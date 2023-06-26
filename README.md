# I Don't Care About Commit Message

Sometimes (if not always), I really don't care much about what my commit message says. Maybe AI can write better than me (sadly, this happens a lot).

## Features ✨

- AI Git Commit: git add . -> git commit -m "AI Generated Message"
- AI Git Push: git add . -> git commit -m "AI Generated Message" -> git push

## Usage

- In the extension settings, set the `OpenAI API Key` (also can set the `model`, default is `gpt-3.5-turbo`).

- `Ctrl+Shift+P` -> Search for `AI Git Commit` or `AI Git Push` -> Press `Enter` -> Done!

## Settings

`OpenAI Model to be used`: OpenAI Model, default is `gpt-3.5-turbo`

here are some advanced models:

- `gpt-3.5-turbo-16k`: great for large file changes, but adds cost if unnecessary files added and still under token limit.
- `gpt-4`: better but expensive

more in https://platform.openai.com/docs/models

## Todo 🎏

- Add loading indicator ✅
- Add error handling
- Ask for key if not set

## Credits

- `I don't care about cookies`: for the funny way of naming
- [Simple Git](https://github.com/steveukx/git-js) @steveukx

## License

MIT
