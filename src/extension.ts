import * as vscode from 'vscode';
import { simpleGit } from 'simple-git';
import { OpenAIApi, Configuration } from 'openai';

let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const gitHelper = simpleGit(workspaceRoot);

async function createCommitMessage(diff: string) {
	const openaiKey = vscode.workspace.getConfiguration('gitCommitAI').get('openaiApiKey') as string;
	const model = vscode.workspace.getConfiguration('gitCommitAI').get('model') as string;

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
		const diff = await gitHelper.diff();
		const commitMsg = await createCommitMessage(diff);
		await gitHelper.add('.').commit(commitMsg);
		vscode.window.showInformationMessage('Commit Successful!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('gitPushAI', async () => {
		const diff = await gitHelper.diff();
		const commitMsg = await createCommitMessage(diff);
		const currentBranch = await gitHelper.revparse(['--abbrev-ref', 'HEAD']);
		await gitHelper.add('.').commit(commitMsg).push('origin', currentBranch);
		vscode.window.showInformationMessage('Push Successful!');
	}));
}

export function deactivate() { }
