import * as fs from 'fs';
import * as path from 'path';
import { FileService } from './files/file.service';
import { DocumentationService } from './documentations/documentation.service';
import { FileTypes } from './constants/enum';
import { FilesLogic } from './logic/file.logic';

export class DocumentationGenerator {
  private fileService: FileService;
  private documentationService: DocumentationService;

  constructor() {
    this.fileService = new FileService();
    this.documentationService = new DocumentationService();
  }

  generateDocumentation(rootDir: string, outputDir: string) {
    const { tree, files } = this.generateTree(rootDir);
    this.createMarkdownFiles(tree, files, outputDir);
  }

  private generateTree(rootDir: string): { tree: string, files: string[] } {
    console.log(this.generateDirectoryTree(rootDir, ''));
    return this.generateDirectoryTree(rootDir, '');
  }

  private generateDirectoryTree(dir: string, prefix: string): { tree: string, files: string[] } {
    const name = path.basename(dir);
    const files = fs.readdirSync(dir);
    let tree = `${prefix ? prefix + '/' : ''}${name}\n`;
    let fileNames: string[] = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (file === 'node_modules') {
            continue;
        }
        if (fs.statSync(filePath).isDirectory()) {
            const subdir = this.generateDirectoryTree(filePath, `${prefix}  `);
            tree += subdir.tree;
            fileNames = fileNames.concat(subdir.files);
        } else {
            const fileName = path.basename(filePath, path.extname(filePath));
            fileNames.push(fileName);
            tree += `${prefix}  ${file}\n`;
        }
    }

    return { tree, files: fileNames };
}

private createMarkdownFiles(tree: string, files: string[], outputDir: string) {
  const lines = tree.split('\n');
  let currentDir = outputDir;

  for (const line of lines) {
    const isDirectory = line.endsWith('/');
    const name = isDirectory ? line.slice(0, -1) : line;

    if (isDirectory) {
      currentDir = path.join(currentDir, name);
      if (!fs.existsSync(currentDir)) {
        fs.mkdirSync(currentDir, { recursive: true });
      }
    } else {
      const filePath = path.join(currentDir, name + '.md');
      const fileContent = this.generateFileContent(name, files);
      fs.writeFileSync(filePath, fileContent);
    }
  }
}


private generateFileContent(name: string, files: string[]): string {
    let content = '';
    const fileType = this.fileService.getFileType(name);

    if (FilesLogic.isFolder(fileType)) {
        content += 'Documentation:\n\n';
        content += 'This part is not implemented yet\n\n';
        const listedFiles = this.fileService.generateFilesList(files);
        content += listedFiles;
    } else if (FilesLogic.isJavaScriptFile(fileType) || FilesLogic.isTypeScriptFile(fileType)) {
        content += 'Documentation:\n\n';
        content += 'This part is not implemented yet\n\n';
    }

    return content;
  }
}
