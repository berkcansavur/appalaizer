import { Dependencies, FileProperties } from '../constants'

export interface IFileService {
  getFileProperties(): FileProperties
  getFunctionalities(): string[]
  getDependencies(): Dependencies
}
