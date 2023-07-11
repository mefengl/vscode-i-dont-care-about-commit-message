import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import * as chai from 'chai';

const { expect } = chai;

const getOpenAIKeyStub = sinon.stub().returns(Promise.resolve('fake_api_key'));

const extension = proxyquire('../../extension', {
	'getOpenAIKey': getOpenAIKeyStub,
});

suite('Extension Test Suite', () => {
	test('createConventionalCommit Test', () => {
		const options = {
			type: 'type',
			scope: 'scope',
			description: 'description',
		};

		const message = extension.createConventionalCommit(options);

		expect(message).to.equal('type(scope): description');
	});

	test('processChatCompletion Test - Conventional Commit', () => {
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
		const commitMsg = extension.processChatCompletion(chatCompletion, true);

		expect(commitMsg).to.equal('type(scope): description\n\nbody\n\nfooter');
	});

	test('processChatCompletion Test - Non-Conventional Commit', () => {
		const chatCompletion = {
			data: {
				choices: [{
					message: {
						content: 'Commit message'
					}
				}]
			}
		};
		const commitMsg = extension.processChatCompletion(chatCompletion, false);

		expect(commitMsg).to.equal('Commit message');
	});
});
