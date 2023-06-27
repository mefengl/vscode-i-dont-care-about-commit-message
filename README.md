# I Don't Care About Commit Message

Yet another AI git commit plugin, but without the need for manual confirmation.

## Features ✨

- AI Git Commit: git add . -> git commit -m "AI Generated Message"
- AI Git Push: git add . -> git commit -m "AI Generated Message" -> git push

## Usage

- `Ctrl+Shift+P`
- Search for `AI Git Commit` or `AI Git Push`
- Press `Enter`
- Done!

> will ask for OpenAI API Key if not set

What's more:

- Add shortcuts to the commands and use them like popping bubble wrap!

## Settings

### Model

Specify the OpenAI Model. The default is `gpt-3.5-turbo`.

Consider these advanced models:

- `gpt-3.5-turbo-16k`: Ideal for large file changes, although it can increase cost if unnecessary files are added and are still within the token limit.
- `gpt-4`: An upgrade but at a higher expense.

For more options, visit [OpenAI Models Documentation](https://platform.openai.com/docs/models).

### OpenAI API Key

Specify the OpenAI API Key.

## Credits

- `I don't care about cookies`: for the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx

## License

MIT
