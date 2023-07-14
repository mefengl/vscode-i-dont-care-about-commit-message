# I Don't Care About Commit Message

Yet another AI git commit plugin, but without the need for manual confirmation.

## Features ✨

- AI Git Commit: git add . -> git commit -m "AI Generated Message"
- AI Git Push: git add . -> git commit -m "AI Generated Message" -> git push

## Usage

- `Ctrl+Shift+P`
- Search for `AI Git Commit` or `AI Git Push`
- Press `Enter`
  > will ask for OpenAI API Key if not set
- Done!

What's more:

- Add shortcuts to the commands and use them like popping bubble wrap!

## Settings

### Model

Specify the OpenAI Model. The default is `gpt-3.5-turbo`.

Consider these advanced models:

- `gpt-3.5-turbo-16k`: Ideal for large file changes, although it can increase cost if unnecessary files are added and are still within the token limit.
- `gpt-4`: An upgrade but at a higher expense.

For more options, visit [OpenAI Models Documentation](https://platform.openai.com/docs/models).

### Conventional Commits Format

Whether to use conventional commit, default is `false`.

looks like this:

```plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

> It will be slower and just a little more expensive since it needs to generate more.

### OpenAI API Key

Specify the OpenAI API Key.

## Language Support

This extension interface supports multiple languages:

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

## Todos 🎏

- Update logic for conventional commit message
- Toggle the conventional commit message format
- Custom the enum of conventional commit format's type and scope

## Development

For development, follow these steps:

1. Clone the repository and navigate into it.
Run `npm install` to install all the necessary dependencies.
2. Run `npm run watch` to start the development server.
3. Press `F5` to start the plugin in a new VSCode window.

For testing, run `npm run test`.

## Credits

- `I don't care about cookies`: For the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx: It would be much harder without this
- [Convensional Commits](https://www.conventionalcommits.org/en/v1.0.0/): For the conventional commit format
  > The `Conventional Commits` format used in this tool is based on the [Conventional Commits specification (v1.0.0)](https://www.conventionalcommits.org/en/v1.0.0/), which is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- [aicommits](https://github.com/Nutlope/aicommits) @Nutlope: The cli ai commit tool I used before I created my own
- [OpenAI API](https://platform.openai.com/docs/api-reference/chat): It makes this extension possible

## License

MIT
