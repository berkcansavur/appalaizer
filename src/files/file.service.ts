import { FileTypes, fileExtensions } from "../constants/enum";
import * as path from 'path';
import { FolderType, FileType } from '../types/types';
import { FilesLogic } from "../logic/file.logic";
import * as fs from 'fs';
export class FileService {
 
  findFileTypeAndFormat(fileName: string): FolderType | FileType {
    if ( FilesLogic.isFolder(fileName)) {
      const folder = this.constructFolderStructure(fileName);
      return folder;
    }
    const file  = this.constructFileStructure(fileName);
    return file;

  }

  findFileExtension(fileName: string): FileTypes {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1) {
        const extension = fileName.substring(dotIndex + 1).toLowerCase();
        return fileExtensions[extension] || FileTypes.Other;
    } else {
        return FileTypes.Folder;
    }
  }

  constructFileStructure(fileName: string): FileType {
    const type = this.findFileExtension(fileName);
    const content = '';
    const file: FileType  = {
      fileName,
      type,
      content
    }
    return file;
  }
  constructFolderStructure(folderName: string): FolderType {
    const files = fs.readdirSync(folderName);
    const folder: FolderType = {folderName, files}; 
    return folder;
  }
}