import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkLockfiles, createConventionalCommit, getGitInfo, processChatCompletion } from '../src/pure';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Extension Test Suite', () => {
	it('createConventionalCommit Test', () => {
		const options = {
			type: 'type',
			scope: 'scope',
			description: 'description',
		};

		const message = createConventionalCommit(options);

		expect(message).toBe('type(scope): description');
	});

	it('processChatCompletion Test - Conventional Commit', () => {
		const chatCompletion = {
			data: {
				choices: [{
					message: {
						function_call: {
							arguments: JSON.stringify({
								type: 'type',
								scope: 'scope',
								description: 'description',
								body: 'body',
								footer: 'footer',
								isBreakingChange: false,
							})
						}
					}
				}]
			}
		};
		const commitMsg = processChatCompletion(chatCompletion, true);

		expect(commitMsg).toBe('type(scope): description\n\nbody\n\nfooter');
	});

	it('processChatCompletion Test - Non-Conventional Commit', () => {
		const chatCompletion = {
			data: {
				choices: [{
					message: {
						content: 'Commit message'
					}
				}]
			}
		};
		const commitMsg = processChatCompletion(chatCompletion, false);

		expect(commitMsg).toBe('Commit message');
	});

	it('checkLockfiles Test', () => {
		const diffFiles = ['src/code.js', 'package-lock.json', 'README.md', 'Gemfile.lock'];
		const lockFiles = checkLockfiles(diffFiles);

		expect(lockFiles).toEqual(['package-lock.json', 'Gemfile.lock']);
	});

	it('getGitInfo Test', () => {
		const input = {
			diff: 'diff data',
			changedLockfiles: ['package-lock.json', 'Gemfile.lock']
		};
		const gitInfo = getGitInfo(input);

		expect(gitInfo).toBe('git diff:\n"""\ndiff data\n"""\nChanged lockfiles:package-lock.json,Gemfile.lock');
	});
});
