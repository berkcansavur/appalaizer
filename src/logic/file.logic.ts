import { FileTypes } from "../constants/enum";

export class FilesLogic {
  static isFolder(fileType: FileTypes) : boolean {
    return fileType === FileTypes.Folder
  }

  static isJavaScriptFile(fileType: FileTypes) : boolean {
    return fileType === FileTypes.JavaScript
  }

  static isTypeScriptFile(fileType: FileTypes) : boolean {
    return fileType === FileTypes.TypeScript
  }
  static isTypeJson(fileType: FileTypes) : boolean {
    return fileType === FileTypes.Json
  }
}