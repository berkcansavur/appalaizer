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

export enum DEPENDENCY_TYPES {
  IMPORT = 'import',
  CONSTRUCTOR = 'this.',
}

export const COMMAND_DESCRIPTIONS: { [command: string]: string } = {
  '--list': 'list of available appalaizer commands',
  '--md': 'creates markdown files for obsidian application',
  '--analyze':
    'creates md files and generates documentation for the specified files with openai',
  '--api-key': 'sets openai api key',
  '--feature':
    'makes feature development on specified file and properly described issue',
}
export const POSITIVE_ANSWERS = ['yes', 'y', 'YES', 'Y', 'OK', 'ok']

export enum FILE_EXTENSIONS {
  TS = '.ts',
  JS = '.js',
  TSX = '.tsx',
  JSX = '.jsx',
  HTML = '.html',
  CSS = '.css',
  JAVA = '.java',
  CSHARP = '.cs',
  RUBY = '.rb',
  SCSS = '.scss',
  JSON = '.json',
  MD = '.md',
  YAML = '.yaml',
  YML = '.yml',
  TXT = '.txt',
  XML = '.xml',
  PNG = '.png',
  JPG = '.jpg',
  JPEG = '.jpeg',
  GIF = '.gif',
  SVG = '.svg',
  GITIGNORE = '.gitignore',
  GITATTRIBUTES = '.gitattributes',
  ESLINTRC = '.eslintrc.json',
  ESLINTJS = '.eslint.js',
  NPMIGNORE = '.npmignore',
  SHELL_SCRIPT = '.sh',
}
