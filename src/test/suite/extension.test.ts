import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import * as chai from 'chai';
import { i18n } from '../../i18n';

const { expect } = chai;

const getOpenAIKeyStub = sinon.stub().returns(Promise.resolve('fake_api_key'));

const extension = proxyquire('../../extension', {
	'getOpenAIKey': getOpenAIKeyStub,
});

suite('Extension Test Suite', () => {
	test('getOpenAIKey Test', async () => {
		const inputStub = sinon.stub(vscode.window, 'showInputBox');
		inputStub.returns(Promise.resolve('fake_api_key'));

		const key = await extension.getOpenAIKey();
		expect(key).to.equal('fake_api_key');

		inputStub.restore();
	});

	test('createConventionalCommit Test', () => {
		const options = {
			type: 'type',
			scope: 'scope',
			description: 'description',
		};

		const message = extension.createConventionalCommit(options);

		expect(message).to.equal('type(scope): description');
	});

	test('prepareGitOperation Test - No workspace opened', async () => {
		const showInfoStub = sinon.stub(vscode.window, 'showInformationMessage');
		sinon.stub(vscode.workspace, 'workspaceFolders').value(undefined);

		const result = await extension.prepareGitOperation();

		expect(showInfoStub.calledWith(i18n.t('no-workspace-opened'))).to.be.true;
		expect(result).to.be.null;

		showInfoStub.restore();
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
