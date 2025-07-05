import * as vscode from 'vscode'
import { simpleGit } from 'simple-git'
import OpenAI from 'openai'
import { i18n } from './i18n'
import { checkLockfiles, getChangedLinesNumber, getGitInfo, processChatCompletion } from './pure'

const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath
const gitHelper = simpleGit(workspaceRoot)

async function getOpenAIKey(): Promise<string> {
  let openaiKey = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('openaiApiKey') as string | undefined
  if (!openaiKey) {
    openaiKey = await vscode.window.showInputBox({ prompt: i18n.t('enter-your-openai-api-key'), password: true })
    if (!openaiKey) {
      vscode.window.showErrorMessage(i18n.t('no-openai-api-key-provided'))
      return ''
    }
    await vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').update('openaiApiKey', openaiKey, vscode.ConfigurationTarget.Global)
  }
  return openaiKey
}

// Function to check if user wants to use Copilot
function shouldUseCopilot(): boolean {
  return vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('useCopilot') as boolean
}

// Function to select Copilot model
async function selectCopilotModel(): Promise<vscode.LanguageModelChat | null> {
  let models = []
  for (let i = 0; i < 10; i++) {
    models = await vscode.lm.selectChatModels({ vendor: 'copilot' })
    if (models.length) break
    await new Promise(r => setTimeout(r, 1000))
  }
  if (!models.length) {
    vscode.window.showErrorMessage(i18n.t('no-copilot-models-available'))
    return null
  }

  // Always show model selection dialog to allow changing the model
  const selectedModelId = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('selectedCopilotModel') as string | undefined
  const modelItems = models.map((m) => {
    // Mark the currently selected model
    const isSelected = m.id === selectedModelId
    return {
      label: isSelected ? `$(check) ${m.name}` : m.name,
      detail: m.id,
      model: m,
    }
  })

  const selectedItem = await vscode.window.showQuickPick(modelItems, {
    placeHolder: i18n.t('select-copilot-model'),
  })

  if (selectedItem) {
    await vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').update('selectedCopilotModel', selectedItem.model.id, vscode.ConfigurationTarget.Global)
    return selectedItem.model
  }

  // If user cancels selection but a model was previously selected, return that model
  if (selectedModelId) {
    const model = models.find(m => m.id === selectedModelId)
    if (model)
      return model
  }

  return null
}

// Function to get chat completion from Copilot
async function getCopilotCompletion(gitInfo: string, isMinimal = false): Promise<any> {
  let model = null
  const selectedModelId = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('selectedCopilotModel') as string | undefined

  if (selectedModelId) {
    let models = []
    for (let i = 0; i < 10; i++) {
      models = await vscode.lm.selectChatModels({ vendor: 'copilot' })
      if (models.length) break
      await new Promise(r => setTimeout(r, 1000))
    }
    model = models.find(m => m.id === selectedModelId)
  }

  if (!model) {
    model = await selectCopilotModel()
    if (!model)
      return null
  }

  const messages = [
    vscode.LanguageModelChatMessage.User(isMinimal ? 'write core change in one or two short words. use one word if clear enough. all lowercase. no punctuation.' : 'only answer with single line of concise commit msg itself'),
    vscode.LanguageModelChatMessage.User(gitInfo),
  ]

  try {
    const token = new vscode.CancellationTokenSource().token
    const chatResponse = await model.sendRequest(messages, {}, token)

    if (!chatResponse)
      return null

    // Create a response similar to what OpenAI would return for consistent processing
    let content = ''
    for await (const fragment of chatResponse.text)
      content += fragment

    return {
      choices: [{
        message: {
          content: content.trim(),
        },
      }],
    }
  }
  catch (err) {
    if (err instanceof vscode.LanguageModelError)
      vscode.window.showErrorMessage(`Copilot error: ${err.message}`)
    else
      vscode.window.showErrorMessage(`Error: ${(err as Error).message}`)

    return null
  }
}

async function getChatCompletion(gitInfo: string, isMinimal = false) {
  // Check if should use Copilot first
  if (shouldUseCopilot())
    return getCopilotCompletion(gitInfo, isMinimal)

  // If not using Copilot, use OpenAI
  const openaiKey = await getOpenAIKey()
  if (!openaiKey)
    return null

  const model = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('model') as string

  const openai = new OpenAI({
    apiKey: openaiKey,
    baseURL: vscode.workspace
      .getConfiguration('iDontCareAboutCommitMessage')
      .get('openaiBaseURL') as string | undefined,
  })

  const useConventionalCommit = !isMinimal && vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('useConventionalCommit') as boolean

  try {
    return await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: isMinimal
            ? 'write core change in one or two short words. use one word if clear enough. all lowercase. no punctuation.'
            : 'only answer with single line of concise commit msg itself',
        },
        {
          role: 'user',
          content: gitInfo,
        },
      ],
      functions: useConventionalCommit
        ? [
            {
              name: 'createConventionalCommit',
              description: 'Create a conventional commit message.',
              parameters: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    description: 'The type of the commit.',
                  },
                  scope: {
                    type: 'string',
                    description: 'The scope or scopes of the commit, separated by a slash.',
                  },
                  description: {
                    type: 'string',
                    description: 'The description of the commit.',
                  },
                  body: {
                    type: 'string',
                    description: 'The body of the commit.',
                  },
                  footer: {
                    type: 'string',
                    description: 'The footer of the commit.',
                  },
                  isBreakingChange: {
                    type: 'boolean',
                    description: 'If the commit introduces a breaking change.',
                  },
                },
                required: ['type', 'description'],
              },
            },
          ]
        : undefined,
      function_call: useConventionalCommit ? { name: 'createConventionalCommit' } : undefined,
    })
  }
  catch (error) {
    if (error instanceof OpenAI.APIError)
      vscode.window.showErrorMessage(error.message)

    return null
  }
}

async function getStagedFiles() {
  return (await gitHelper.diff(['--name-only', '--cached'])).split('\n').filter(Boolean)
}

async function selectAndStageFiles() {
  const unstagedFiles = (await gitHelper.diff(['--name-only'])).split('\n').filter(Boolean)
  const selectedFiles = await vscode.window.showQuickPick(unstagedFiles, {
    canPickMany: true,
    placeHolder: i18n.t('select-files-to-stage'),
  })
  if (selectedFiles)
    await gitHelper.add(selectedFiles)
}

async function processGitOperation(
  title: string,
  operation: (commitMsg: string) => Promise<void>,
  addAll: boolean = true,
  isMinimal: boolean = false,
) {
  if (!workspaceRoot) {
    vscode.window.showInformationMessage(i18n.t('no-workspace-opened'))
    return
  }
  if (addAll)
    await gitHelper.add('.')

  const diffFiles = (await gitHelper.diff(['--name-only', '--staged'])).split('\n')
  const changedLockfiles = checkLockfiles(diffFiles)
  const stat = await gitHelper.diff(['--shortstat', '--staged'])

  let gitInfo = ''
  const shouldMoreContext = getChangedLinesNumber(stat) < 10
  const diffOptions = ['--staged', ...(shouldMoreContext ? ['-U10'] : [])]
  try {
    const diff = await gitHelper.diff([...diffOptions, ...changedLockfiles.map(lockfile => `:!${lockfile}`)])
    gitInfo = getGitInfo({ diff, changedLockfiles })
  }
  catch (e) {
    const diff = await gitHelper.diff(diffOptions)
    gitInfo = getGitInfo({ diff, changedLockfiles: [] })
  }

  if (!gitInfo) {
    vscode.window.showInformationMessage(i18n.t('no-changes-to-commit'))
    return
  }

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title,
    cancellable: false,
  }, async () => {
    const chatCompletion = await getChatCompletion(gitInfo, isMinimal)
    const useConventionalCommit = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('useConventionalCommit') as boolean
    const commitMsg = processChatCompletion(chatCompletion, useConventionalCommit)
    await operation(commitMsg)
  })
}

async function handleStagedFiles(action: 'commit' | 'push') {
  if (!workspaceRoot) {
    vscode.window.showInformationMessage(i18n.t('no-workspace-opened'))
    return
  }

  let stagedFiles = await getStagedFiles()
  if (stagedFiles.length === 0) {
    await selectAndStageFiles()
    stagedFiles = await getStagedFiles()
    if (stagedFiles.length === 0) {
      vscode.window.showInformationMessage(i18n.t('no-changes-to-commit'))
      return
    }
  }

  await processGitOperation(i18n.t(`processing-git-${action}`), async (commitMsg) => {
    if (action === 'push') {
      const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD'])
      await gitHelper.commit(commitMsg).push('origin', currentBranch)
      vscode.window.showInformationMessage(i18n.t('push-successful'))
    }
    else {
      await gitHelper.commit(commitMsg)
      vscode.window.showInformationMessage(i18n.t('commit-successful'))
    }
  }, false)
}

async function handleStagedFilesMinimal(action: 'commit' | 'push') {
  if (!workspaceRoot) {
    vscode.window.showInformationMessage(i18n.t('no-workspace-opened'))
    return
  }

  let stagedFiles = await getStagedFiles()
  if (stagedFiles.length === 0) {
    await selectAndStageFiles()
    stagedFiles = await getStagedFiles()
    if (stagedFiles.length === 0) {
      vscode.window.showInformationMessage(i18n.t('no-changes-to-commit'))
      return
    }
  }

  await processGitOperation(i18n.t(`processing-git-${action}`), async (commitMsg) => {
    if (action === 'push') {
      const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD'])
      await gitHelper.commit(commitMsg).push('origin', currentBranch)
      vscode.window.showInformationMessage(i18n.t('push-successful'))
    }
    else {
      await gitHelper.commit(commitMsg)
      vscode.window.showInformationMessage(i18n.t('commit-successful'))
    }
  }, false, true)
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('gitCommitAI', async () => {
    await processGitOperation(i18n.t('processing-git-commit'), async (commitMsg) => {
      await gitHelper.commit(commitMsg)
      vscode.window.showInformationMessage(i18n.t('commit-successful'))
    })
  }))

  context.subscriptions.push(vscode.commands.registerCommand('gitPushAI', async () => {
    await processGitOperation(i18n.t('processing-git-push'), async (commitMsg) => {
      const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD'])
      await gitHelper.commit(commitMsg).push('origin', currentBranch)
      vscode.window.showInformationMessage(i18n.t('push-successful'))
    })
  }))

  context.subscriptions.push(vscode.commands.registerCommand('gitCommitStagedAI', () => handleStagedFiles('commit')))
  context.subscriptions.push(vscode.commands.registerCommand('gitPushStagedAI', () => handleStagedFiles('push')))

  context.subscriptions.push(vscode.commands.registerCommand('gitCommitX', async () => {
    if (!workspaceRoot) {
      vscode.window.showInformationMessage(i18n.t('no-workspace-opened'))
      return
    }

    await gitHelper.add('.')
    await gitHelper.commit('x')
    vscode.window.showInformationMessage('Commit successful with message "x"')
  }))

  context.subscriptions.push(vscode.commands.registerCommand('gitCommitMinimal', async () => {
    await processGitOperation(i18n.t('processing-git-commit'), async (commitMsg) => {
      await gitHelper.commit(commitMsg)
      vscode.window.showInformationMessage(i18n.t('commit-successful'))
    }, true, true)
  }))

  context.subscriptions.push(vscode.commands.registerCommand('gitPushMinimal', async () => {
    await processGitOperation(i18n.t('processing-git-push'), async (commitMsg) => {
      const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD'])
      await gitHelper.commit(commitMsg).push('origin', currentBranch)
      vscode.window.showInformationMessage(i18n.t('push-successful'))
    }, true, true)
  }))

  context.subscriptions.push(vscode.commands.registerCommand('gitCommitStagedMinimal', () => handleStagedFilesMinimal('commit')))
  context.subscriptions.push(vscode.commands.registerCommand('gitPushStagedMinimal', () => handleStagedFilesMinimal('push')))

  // Add a new command to select Copilot model
  context.subscriptions.push(vscode.commands.registerCommand('selectCopilotModel', async () => {
    await selectCopilotModel()
  }))
}

export function deactivate() { }
