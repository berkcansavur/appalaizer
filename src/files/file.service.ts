import { FileTypes } from "../constants/enum";
import * as path from 'path';
export class FileService {
  formatFileName(fileName: string): string {
      return ` - [[${fileName}.ts ]]\n`
  }
  generateFilesList(fileNames: string[]): string {
    let content = 'Files:\n ';
    fileNames.forEach((fileName) => {
      content += `${this.formatFileName(fileName)} `;
    });
    return content;
  }
  getFileType(name: string): FileTypes {
    // Dosyanın uzantısını al
    const extension = path.extname(name);

    // Uzantının varlığına göre dosya tipini belirle
    switch (extension) {
        case '.ts':
            return FileTypes.TypeScript;
        case '.js':
            return FileTypes.JavaScript;
        default:
            return FileTypes.Folder;
    }
}
}