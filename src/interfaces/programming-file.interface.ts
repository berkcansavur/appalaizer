import { Dependencies } from '../constants'

export interface IProgrammingFile {
  getFunctionalities(): string[]
  getDependencies(): Dependencies
}
