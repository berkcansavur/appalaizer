import { IFileService } from 'interfaces'
import { FileProperties } from '../../constants'

export class DefaultFile implements IFileService {
  private fileContent: string

  constructor(fileContent: string) {
    this.fileContent = fileContent
  }

  getFileProperties(): FileProperties {
    const fileProperties: FileProperties = {}
    if (this.fileContent) {
      fileProperties.content = this.fileContent
    }

    return fileProperties
  }
}
