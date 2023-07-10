import * as chai from 'chai';
import * as vscode from 'vscode';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
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
			type: 'feat',
			scope: 'login',
			description: 'add login feature',
		};

		const message = extension.createConventionalCommit(options);

		expect(message).to.equal('feat(login): add login feature');
	});

	test('prepareGitOperation Test - No workspace opened', async () => {
		const showInfoStub = sinon.stub(vscode.window, 'showInformationMessage');
		sinon.stub(vscode.workspace, 'workspaceFolders').value(undefined);

		const result = await extension.prepareGitOperation();

		expect(showInfoStub.calledWith(i18n.t('no-workspace-opened'))).to.be.true;
		expect(result).to.be.null;

		showInfoStub.restore();
	});
});
