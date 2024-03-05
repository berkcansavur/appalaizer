import * as fs from 'fs';
import * as path from 'path';
import { FileHandlerFactory } from '../factories/file-handler.factory';
export class ProjectTreeService {
  generateProjectTree(inputPath: string, outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(path.join(outputDir, 'files'))) {
      fs.mkdirSync(path.join(outputDir, 'files'));
    }
    
    if (!fs.existsSync(path.join(outputDir, 'folders'))) {
      fs.mkdirSync(path.join(outputDir, 'folders'));
    }
      const files = fs.readdirSync(inputPath, { withFileTypes: true });
      files.forEach(file => {
          const filePath = path.join(inputPath, file.name);
          const fileType = file.isDirectory() ? 'folder' : 'file';
          const fileHandler = FileHandlerFactory.getFileHandler(fileType);
          fileHandler.handleFile(filePath, outputDir);
      });
  }
}