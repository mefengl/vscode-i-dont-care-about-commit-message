import * as fs from 'node:fs'
import * as path from 'node:path'
import { env } from 'vscode'

const memo: Record<string, any> = {}

export const i18n = {
  t: (key: string): string => {
    const locale = env.language.toLocaleLowerCase() || 'en'
    memo[locale] = memo[locale] || JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'locales', `${locale}.json`), 'utf8'))
    return memo[locale][key] || `Missing key: ${key}`
  },
}
