import * as vscode from 'vscode';
import { simpleGit } from 'simple-git';
import { OpenAIApi, Configuration } from 'openai';

let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const gitHelper = simpleGit(workspaceRoot);

async function getOpenAIKey(): Promise<string> {
	let openaiKey = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('openaiApiKey') as string | undefined;
	if (!openaiKey) {
		openaiKey = await vscode.window.showInputBox({ prompt: 'Enter your OpenAI API Key' });
		if (!openaiKey) {
			vscode.window.showErrorMessage('No OpenAI API Key provided.');
			return '';
		}
		await vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').update('openaiApiKey', openaiKey, vscode.ConfigurationTarget.Global);
	}
	return openaiKey;
}

async function createCommitMessage(diff: string) {
	const openaiKey = await getOpenAIKey();
	if (!openaiKey) {
		return '';
	}
	const model = vscode.workspace.getConfiguration('iDontCareAboutCommitMessage').get('model') as string;
	const configuration = new Configuration({ apiKey: openaiKey });
	const openai = new OpenAIApi(configuration);

	const chatCompletion = await openai.createChatCompletion(
		{
			model: model,
			messages: [
				{
					role: "system",
					content: "only answer with single line of commit msg itself"
				},
				{
					role: 'user',
					content: `git diff:\n${diff}`
				}],
		});
	return chatCompletion.data.choices[0].message?.content || '';
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('gitCommitAI', async () => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Processing Git Commit",
			cancellable: false
		}, async () => {
			const diff = await gitHelper.diff();
			const commitMsg = await createCommitMessage(diff);
			await gitHelper.add('.').commit(commitMsg);
		});
		vscode.window.showInformationMessage('Commit Successful!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('gitPushAI', async () => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Processing Git Push",
			cancellable: false
		}, async () => {
			const diff = await gitHelper.diff();
			const commitMsg = await createCommitMessage(diff);
			const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD']);
			await gitHelper.add('.').commit(commitMsg).push('origin', currentBranch);
		});
		vscode.window.showInformationMessage('Push Successful!');
	}));
}

export function deactivate() { }
