interface CreateConventionalCommitOptions {
  type: string
  scope?: string
  description: string
  body?: string
  footer?: string
  isBreakingChange?: boolean
}

export function getChangedLinesNumber(stat: string) {
  const changedLines = stat.match(/(\d+) (?:file|files) changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/)
  if (!changedLines)
    return 0
  const [, changedFiles = '0', insertions = '0', deletions = '0'] = changedLines
  return Number.parseInt(changedFiles) + Number.parseInt(insertions) + Number.parseInt(deletions)
}

export function createConventionalCommit({
  type,
  scope,
  description,
  body,
  footer,
  isBreakingChange,
}: CreateConventionalCommitOptions) {
  let commitMessage = `${type}${scope ? `(${scope})` : ''}${isBreakingChange ? '!' : ''
    }: ${description}`

  if (body)
    commitMessage += `\n\n${body}`

  if (isBreakingChange)
    commitMessage += `\n\nBREAKING CHANGE: ${description}`

  if (footer)
    commitMessage += `\n\n${footer}`

  return commitMessage
}

export function processChatCompletion(chatCompletion: any, useConventionalCommit: boolean) {
  if (!chatCompletion)
    return ''
  if (useConventionalCommit) {
    const content = chatCompletion.choices[0].message?.function_call?.arguments
    if (!content)
      return ''

    const contentJSON = JSON.parse(content) as CreateConventionalCommitOptions
    return removeQuotes(createConventionalCommit(contentJSON))
  }
  else {
    return removeQuotes(chatCompletion.choices[0].message?.content || '')
  }
}

export function checkLockfiles(diffFiles: string[]) {
  return ['package-lock.json', 'yarn.lock', 'Gemfile.lock', 'composer.lock', 'pnpm-lock.yaml', 'go.sum', 'cargo.lock', 'poetry.lock', 'mix.lock']
    .filter(lockfile => diffFiles.includes(lockfile))
}

export function getGitInfo({ diff, changedLockfiles }: {
  diff: string
  changedLockfiles: string[]
}) {
  let gitInfo = ''
  if (diff)
    gitInfo += `git diff:\n"""\n${diff}\n"""\n`

  if (changedLockfiles?.length)
    gitInfo += `Changed lockfiles:${changedLockfiles.join(',')}`

  return gitInfo
}

export function removeQuotes(str: string): string {
  return str.replace(/^"|"$/g, '')
}
