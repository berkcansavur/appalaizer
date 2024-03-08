import { FileHandler } from '../interfaces/file-handler.interface'
import { DefaultFileService } from '../services/default-file.service'
import { FolderHandler } from '../services/folder.service'

export class FileHandlerFactory {
  static getFileHandler(fileType: string): FileHandler {
    if (fileType === 'folder') {
      return new FolderHandler()
    } else {
      return new DefaultFileService()
    }
  }
}
