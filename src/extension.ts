import * as vscode from 'vscode';
import { simpleGit } from 'simple-git';
import { OpenAIApi, Configuration } from 'openai';
import { i18n } from './i18n';
import { checkLockfiles, getGitInfo, processChatCompletion } from './pure';

let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const gitHelper = simpleGit(workspaceRoot);

async function getOpenAIKey(): Promise<string> {
	let openaiKey = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('openaiApiKey') as string | undefined;
	if (!openaiKey) {
		openaiKey = await vscode.window.showInputBox({ prompt: i18n.t('enter-your-openai-api-key') });
		if (!openaiKey) {
			vscode.window.showErrorMessage(i18n.t('no-openai-api-key-provided'));
			return '';
		}
		await vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').update('openaiApiKey', openaiKey, vscode.ConfigurationTarget.Global);
	}
	return openaiKey;
}

async function getChatCompletion(gitInfo: string) {
	const openaiKey = await getOpenAIKey();
	if (!openaiKey) {
		return null;
	}
	const model = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('model') as string;
	const configuration = new Configuration({ apiKey: openaiKey });
	const openai = new OpenAIApi(configuration);
	const useConventionalCommit = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('useConventionalCommit') as boolean;

	return await openai.createChatCompletion(
		{
			model: model,
			messages: [
				{
					role: "system",
					content: "only answer with single line of commit msg itself"
				},
				{
					role: "user",
					content: gitInfo
				}
			],
			functions: useConventionalCommit ? [
				{
					name: "createConventionalCommit",
					description: "Create a conventional commit message.",
					parameters: {
						type: "object",
						properties: {
							type: {
								type: "string",
								description: "The type of the commit."
							},
							scope: {
								type: "string",
								description: "The scope or scopes of the commit, separated by a slash."
							},
							description: {
								type: "string",
								description: "The description of the commit."
							},
							body: {
								type: "string",
								description: "The body of the commit."
							},
							footer: {
								type: "string",
								description: "The footer of the commit."
							},
							isBreakingChange: {
								type: "boolean",
								description: "If the commit introduces a breaking change."
							}
						},
						required: ["type", "description"]
					}
				}
			] : undefined,
			function_call: useConventionalCommit ? { name: "createConventionalCommit" } : undefined
		}
	);
}

async function processGitOperation(title: string, operation: (commitMsg: string) => Promise<void>) {
	if (!workspaceRoot) {
		vscode.window.showInformationMessage(i18n.t('no-workspace-opened'));
		return;
	}
	await gitHelper.add('.');
	const diffFiles = (await gitHelper.diff(['--name-only', '--staged'])).split('\n');
	const changedLockfiles = checkLockfiles(diffFiles);
	let diff = '';
	let gitInfo = '';
	try {
		diff = await gitHelper.diff(['--staged', ...changedLockfiles.map(lockfile => `:!${lockfile}`)]);
		gitInfo = getGitInfo({ diff, changedLockfiles });
	} catch (e) {
		diff = await gitHelper.diff(['--staged']);
		gitInfo = getGitInfo({ diff, changedLockfiles: [] });
	}
	if (!gitInfo) {
		vscode.window.showInformationMessage(i18n.t('no-changes-to-commit'));
		return;
	}

	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: title,
		cancellable: false
	}, async () => {
		const chatCompletion = await getChatCompletion(gitInfo);
		const useConventionalCommit = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('useConventionalCommit') as boolean;
		const commitMsg = processChatCompletion(chatCompletion, useConventionalCommit);
		await operation(commitMsg);
	});
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('gitCommitAI', async () => {
		await processGitOperation(i18n.t('processing-git-commit'), async commitMsg => {
			await gitHelper.commit(commitMsg);
			vscode.window.showInformationMessage(i18n.t('commit-successful'));
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('gitPushAI', async () => {
		await processGitOperation(i18n.t('processing-git-push'), async commitMsg => {
			const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD']);
			await gitHelper.commit(commitMsg).push('origin', currentBranch);
			vscode.window.showInformationMessage(i18n.t('push-successful'));
		});
	}));
}

export function deactivate() { }
