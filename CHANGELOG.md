# Change Log

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.5.1] - 2023-07-21

- Update: add 'concise' to the default prompt

## [0.5.0] - 2023-07-19

- Add: support manual staged files

## [0.4.5] - 2023-07-19

- Chore: add gif to README

## [0.4.4] - 2023-07-18

- Update: update description to "A VS Code extension aiming to keep commit keystrokes to a bare minimum via LLM."

## [0.4.3] - 2023-07-18

- Fix: fix a condition for getting more context in git diff

## [0.4.2] - 2023-07-17

- Add: add more context to the prompt message when changes are small

## [0.4.1] - 2023-07-15

- Fix: resolve git's compatibility issue with pathspec magic

## [0.4.0] - 2023-07-12

- Update: Simplify the diff of lock files
- 0.4.0🎉: complete todos in 0.3.x
  - Update prompt format for untracked files ✅
  - Add option for simple `Conventional Commits` format ✅
  - i18n ✅
  - Add base tests ✅
  - Add base CI ✅
  - Extract pure logic out to use Vitest ✅
  - Simplify the diff of lock files ✅

## [0.3.2] - 2023-07-10

- Add: base tests

## [0.3.1] - 2023-07-07

- Update: Also i18n the language support table

## [0.3.0] - 2023-07-06

### Added

- Internationalization support with language translation
  - Added language files for multiple languages

## [0.2.1] - 2023-07-04

- Update credits in README

## [0.2.0] - 2023-07-04

- Added option to use Conventional Commits format, along with a description in the README
- Added reference and credit for Conventional Commits in README
- Updated the prompt process for the OpenAI API Key
- Completed the "Add option for simple `Conventional Commits` format" task in the Todos

## [0.1.4] - 2023-06-30

- Fix: fixed "staged files will have empty diff" issue

## [0.1.3] - 2023-06-28

- Update error handling: create VSCodeError class to handle issues

## [0.1.2] - 2023-06-28

- Fix: remove unnecessary message used by development

## [0.1.1] - 2023-06-27

- Fix: new files that are not tracked by git will use another way to prompt instead of diff

## [0.1.0] - 2023-06-27

- Add edge case handling: no changes now will exit with a message
- Update README.md

## [0.0.6] - 2023-06-27

- Update package.json: add categories and keywords

## [0.0.5] - 2023-06-27

- Add feature: ask for key if not set

## [0.0.4] - 2023-06-27

- Update README.md

## [0.0.3] - 2023-06-27

- Add loading indicator

## [0.0.2] - 2023-06-26

- Update README.md

## [0.0.1] - 2023-06-26

- Initial release

## [Unreleased]

- Initial release
