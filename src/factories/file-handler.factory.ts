import { FileHandler } from '../interfaces/file-handler.interface'
import { BaseFileService } from '../services/files/base-file.service'
import { FolderHandler } from '../services/folder.service'

export class FileHandlerFactory {
  static getFileHandler(fileType: string): FileHandler {
    if (fileType === 'folder') {
      return new FolderHandler()
    } else {
      return new BaseFileService()
    }
  }
}
