import { TypeScriptFile, JavaScriptFile, DefaultFile } from '../services'
import { FILE_EXTENSIONS } from '../constants'
import { IFileService } from 'interfaces'

export class FileServiceFactory {
  static getFileHandler(fileExtension: string, fileContent: string) {
    const fileHandlers: {
      [extension: string]: new (fileContent: string) => IFileService
    } = {
      [FILE_EXTENSIONS.TS]: TypeScriptFile,
      [FILE_EXTENSIONS.JS]: JavaScriptFile,
    }

    const FileHandler = fileHandlers[fileExtension]
    console.log(`filePath:  ${JSON.stringify(FileHandler)}`)
    if (FileHandler) {
      return new FileHandler(fileContent)
    } else {
      const FileHandler = DefaultFile
      return new FileHandler(fileContent)
    }
  }
}
