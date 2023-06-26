# I Don't Care About Commit Message

Sometimes (if not always), I really don't care much about what my commit message says. Maybe AI can write better than me (sadly, this happens a lot).

## Features ✨

- AI Git Commit: git add . -> git commit -m "AI Generated Message"
- AI Git Push: git add . -> git commit -m "AI Generated Message" -> git push

## Usage

- In the extension settings, set the `OpenAI API Key` (also can set the `model`, default is `gpt-3.5-turbo`).
- `Ctrl+Shift+P` -> Search for `AI Git Commit` or `AI Git Push` -> Press `Enter` -> Done!

what's more:

- Add shortcuts to the commands and use them like popping bubble wrap!

## Settings

`OpenAI Model to be used`: Specify the OpenAI Model. The default is `gpt-3.5-turbo`.

Consider these advanced models:

- `gpt-3.5-turbo-16k`: Ideal for large file changes, although it can increase cost if unnecessary files are added and are still within the token limit.
- `gpt-4`: An upgrade but at a higher expense.
For more options, visit OpenAI Models Documentation.

## Todo 🎏

- Add loading indicator ✅
- Add error handling
- Ask for key if not set

## Credits

- `I don't care about cookies`: for the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx

## License

MIT
