import { afterEach, describe, expect, it, vi } from 'vitest';
import { createConventionalCommit, processChatCompletion } from '../src/pure';

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
});
