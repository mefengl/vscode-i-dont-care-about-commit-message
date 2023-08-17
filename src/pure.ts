type CreateConventionalCommitOptions = {
  type: string;
  scope?: string;
  description: string;
  body?: string;
  footer?: string;
  isBreakingChange?: boolean;
};

export const getChangedLinesNumber = (stat: string) => {
  const changedLines = stat.match(/(\d+) (?:file|files) changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/);
  if (!changedLines) { return 0; }
  const [, changedFiles = '0', insertions = '0', deletions = '0'] = changedLines;
  return parseInt(changedFiles) + parseInt(insertions) + parseInt(deletions);
};

export const createConventionalCommit = ({
  type,
  scope,
  description,
  body,
  footer,
  isBreakingChange,
}: CreateConventionalCommitOptions) => {
  let commitMessage = `${type}${scope ? `(${scope})` : ""}${isBreakingChange ? "!" : ""
    }: ${description}`;

  if (body) {
    commitMessage += `\n\n${body}`;
  }

  if (isBreakingChange) {
    commitMessage += `\n\nBREAKING CHANGE: ${description}`;
  }

  if (footer) {
    commitMessage += `\n\n${footer}`;
  }

  return commitMessage;
};

export function processChatCompletion(chatCompletion: any, useConventionalCommit: boolean) {
  if (!chatCompletion) { return ''; }
  if (useConventionalCommit) {
    const content = chatCompletion.choices[0].message?.function_call?.arguments;
    if (!content) {
      return '';
    }
    const contentJSON = JSON.parse(content) as CreateConventionalCommitOptions;
    return createConventionalCommit(contentJSON);
  } else {
    return chatCompletion.choices[0].message?.content || '';
  }
}

export const checkLockfiles = (diffFiles: string[]) =>
  ["package-lock.json", "yarn.lock", "Gemfile.lock", "composer.lock", "pnpm-lock.yaml", "go.sum", "cargo.lock", "poetry.lock", "mix.lock"]
    .filter(lockfile => diffFiles.includes(lockfile));

export const getGitInfo = ({ diff, changedLockfiles }: {
  diff: string; changedLockfiles: string[]
}) => {
  let gitInfo = "";
  if (diff) {
    gitInfo += `git diff:\n"""\n${diff}\n"""\n`;
  }
  if (changedLockfiles?.length) {
    gitInfo += `Changed lockfiles:${changedLockfiles.join(',')}`;
  }
  return gitInfo;
};
