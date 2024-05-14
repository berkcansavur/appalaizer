import { FILE_EXTENSIONS } from '../constants'

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
  structs?: Structs
  extension?: FILE_EXTENSIONS
}

export type Structs = {
  interfaces?: string[]
  classes?: string[]
  abstractClasses?: string[]
  types?: string[]
}
