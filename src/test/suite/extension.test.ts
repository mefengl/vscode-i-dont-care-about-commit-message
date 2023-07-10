import * as assert from 'assert';
import * as vscode from 'vscode';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { i18n } from '../../i18n';

const getOpenAIKeyStub = sinon.stub().returns(Promise.resolve('fake_api_key'));

const extension = proxyquire('../../extension', {
	'getOpenAIKey': getOpenAIKeyStub,
});

suite('Extension Test Suite', () => {
	test('getOpenAIKey Test', async () => {
		const inputStub = sinon.stub(vscode.window, 'showInputBox');
		inputStub.returns(Promise.resolve('fake_api_key'));

		const key = await extension.getOpenAIKey();
		assert.strictEqual(key, 'fake_api_key');

		inputStub.restore();
	});

	test('createConventionalCommit Test', () => {
		const options = {
			type: 'feat',
			scope: 'login',
			description: 'add login feature',
		};

		const message = extension.createConventionalCommit(options);

		assert.strictEqual(
			message,
			'feat(login): add login feature',
			'Commit message does not match expected format.'
		);
	});

	test('prepareGitOperation Test - No workspace opened', async () => {
		const showInfoStub = sinon.stub(vscode.window, 'showInformationMessage');
		sinon.stub(vscode.workspace, 'workspaceFolders').value(undefined);

		const result = await extension.prepareGitOperation();

		assert(showInfoStub.calledWith(i18n.t('no-workspace-opened')));
		assert.strictEqual(result, null);

		showInfoStub.restore();
	});

});
