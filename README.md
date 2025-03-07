<!-- DO NOT REMOVE - contributor_list:data:start:["mefengl", "renovate[bot]", "esonwong"]:end -->
# I Don't Care About Commit Message

Yet another AI git commit plugin for VSCode, but without the need for manual confirmation!

Aiming to keep commit keystrokes to a bare minimum via LLM.

![I Don't Care About Commit Message](https://raw.githubusercontent.com/mefengl/vscode-i-dont-care-about-commit-message/main/res/vscode-i-dont-care-about-commit-message.gif "Demonstration of AI Git Commit Plugin")

[Visit Github Repository | 访问 Github 仓库 | Githubのリポジトリを見る](https://github.com/mefengl/vscode-i-dont-care-about-commit-message)

[Join Discord Server | 加入 Discord 讨论 | Discordのディスカッションに参加する](https://discord.gg/pwTKpnc2sF)

## Features ✨ - AI Git Commit Plugin

- **AI Git Commit**: Simplify your commits with `git add . -> git commit -m "AI Generated Message"`.
- **AI Git Push**: Automate the entire process: `git add . -> git commit -m "AI Generated Message" -> git push`.
- **AI Git Commit/Push (Minimal)**: Same as above but generates ultra-minimal 1-3 word commit messages.

> AI Git Commit/Push Stage: Same as above, but without using the command `git add .`.

## Usage - AI Git Extension for VSCode

- `Ctrl+Shift+P`
- Search for `AI Git Commit` or `AI Git Push`.
- Press `Enter`.
  > Will ask for OpenAI API Key if not set, or use GitHub Copilot if enabled.
- Done!

What's more:

- Add shortcuts to the commands and use them like popping bubble wrap with this AI git extension!

## Settings

### Use GitHub Copilot

Enable `useCopilot` option to use GitHub Copilot for generating commit messages instead of OpenAI API.
This requires an active GitHub Copilot subscription.

To select a specific Copilot model, use the command `AI Git Commit: Select Copilot Model`.

### Model

Specify the OpenAI Model. The default is `gpt-3.5-turbo`.

Consider these advanced models:

- `gpt-3.5-turbo-16k`: Ideal for large file changes, although it can increase cost if unnecessary files are added and are still within the token limit.
- `gpt-4`: An upgrade but at a higher expense.

For more options, visit [OpenAI Models Documentation](https://platform.openai.com/docs/models).

### Conventional Commits Format

Whether to use conventional commit, default is `false`.

Looks like this:

```plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

> It will be slower and just a little more expensive since it needs to generate more.

### OpenAI API Key

Specify the OpenAI API Key for this AI git extension.

### OpenAI API Base URL

Specify the OpenAI API Base URL, default is `https://api.openai.com/v1`.

## Language Support

This AI git commit plugin interface supports multiple languages, making it accessible for developers around the world:

| Language            | Code   | Language            | Code   |
| ------------------- | ------ | ------------------- | ------ |
| English (US)        | en     | Italiano            | it     |
| 简体中文             | zh-cn  | Español             | es     |
| 繁體中文             | zh-tw  | 日本語               | ja     |
| Français            | fr     | 한국어               | ko     |
| Deutsch             | de     | Русский             | ru     |
| Português (Brasil)  | pt-br  | Türkçe              | tr     |
| Polski              | pl     | Čeština             | cs     |
| Magyar              | hu     |                     |        |

## Development - Building the AI Git Commit Plugin

For development, follow these steps:

1. Clone the repository and navigate into it.
2. Run `npm install` to install all the necessary dependencies.
3. Run `npm run watch` to start the development server.
4. Press `F5` to start the plugin in a new VSCode window.

For testing, run `npm run test`.

## Credits

- `I don't care about cookies`: For the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx: It would be much harder without this
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): For the conventional commit format
  > The `Conventional Commits` format used in this tool is based on the [Conventional Commits specification (v1.0.0)](https://www.conventionalcommits.org/en/v1.0.0/), which is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- [aicommits](https://github.com/Nutlope/aicommits) @Nutlope: The CLI AI commit tool I used before I created my own
- [OpenAI API](https://platform.openai.com/docs/api-reference/chat): It makes this AI git extension possible
- [GitHub Copilot](https://github.com/features/copilot): Alternative AI provider for generating commit messages
- [weekly](https://github.com/ruanyf/weekly) @ruanyf: For making this project known and used by more people

## License

MIT

<!-- prettier-ignore-start -->
<!-- DO NOT REMOVE - contributor_list:start -->
## 👥 Contributors

- **[@mefengl](https://github.com/mefengl)**

- **[@renovate[bot]](https://github.com/apps/renovate)**

- **[@esonwong](https://github.com/esonwong)**

<!-- DO NOT REMOVE - contributor_list:end -->
<!-- prettier-ignore-end -->
