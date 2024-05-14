export type DirectoryInfo = {
  name: string
  isFolder: boolean
  realPath: string
}

export type Dependencies = {
  constructorDependencies: string[]
  importedDependencies: string[]
}

export type FileProperties = {
  content?: string
  dependencies?: Dependencies
  functionalities?: string[]
}
