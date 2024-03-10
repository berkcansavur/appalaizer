export * from './prompts'
export * from './types'
export * from './languages'
export const ignoreList = [
  '.DS_Store',
  'docs',
  'folders',
  'files',
  'node_modules',
  'dist',
  'jest.config.js',
  '.git',
  '.gitignore',
  '.gitattributes',
  '.eslint.js',
  '.eslintrc.json',
  '.npmignore',
  'ignores',
]

export const COMMAND_DESCRIPTIONS: { [command: string]: string } = {
  "--list": "list of available appalaizer commands",
  "--md": "creates markdown files for obsidian application",
  "--analyze": "creates md files and generates documentation for the specified files with openai",
  "--api-key": "sets openai api key",
};



