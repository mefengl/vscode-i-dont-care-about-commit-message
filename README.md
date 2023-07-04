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

```txt
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

> It will be slower and just a little more expensive since it needs to generate more.

### OpenAI API Key

Specify the OpenAI API Key.

## Todos 🎏

- Update prompt format for untracked files ✅
- Add option for simple `Conventional Commits` format ✅
- Add base tests
- Refine error handling

## Credits

- `I don't care about cookies`: for the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx
- [Convensional Commits](https://www.conventionalcommits.org/en/v1.0.0/): for the conventional commit format
  > The `Conventional Commits` format used in this tool is based on the [Conventional Commits specification (v1.0.0)](https://www.conventionalcommits.org/en/v1.0.0/), which is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

## License

MIT
