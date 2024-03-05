import * as fs from 'fs';
import * as path from 'path';
import { FileService } from './files/file.service';
import { DocumentationService } from './documentations/documentation.service';
import { FilesLogic } from './logic/file.logic';
import { FolderType } from './types/types';

export class DocumentationGenerator {
  private fileService: FileService;
  private documentationService: DocumentationService;

  constructor() {
    this.fileService = new FileService();
    this.documentationService = new DocumentationService();
  }

  generateDocumentation(rootDir: string, outputDir: string) {
    const { tree, files } = this.generateTree(rootDir,['node_modules','git/objects']);
  }

  private generateTree(rootDir: string, unwantedDirectories?: string[]): { tree: string, files: string[] } {
    console.log(this.generateDirectoryTree(rootDir, ''));
    return this.generateDirectoryTree(rootDir, '', unwantedDirectories);
  }
  filterBranches (dir: string) {
    const branches = fs.readdirSync(dir);
    const folders : string[] = [];
    const files: string[] = [];
    branches.map((branch) => {
      const filePath  = this.getToNamespacePath(branch);
      if (FilesLogic.isFolder(filePath)) {
        folders.push(branch);
      }
      files.push(branch);
    });
    return {folders, files};
  }
  constructFolderStructure(folderName: string): FolderType {
    const files = fs.readdirSync(folderName);
    const folder: FolderType = {folderName, files}; 
    return folder;
  }
  getToNamespacePath(rootDir: string): string {
    // returns like  src/constants
    return path.toNamespacedPath(rootDir);    
  }
  generateMarkdownFiles(foldersWithFiles: [Map<string, string[]>]){
    foldersWithFiles.map((folder) =>{
    })
  }

  private generateDirectoryTree(dir: string, prefix: string, unwantedDirectories?: string[]): { tree: string, files: string[] } {
    const name = path.basename(dir);
    const files = fs.readdirSync(dir);
    console.log('files: ' + files);
    files.map((file) =>{
      const toNamespacedPath = path.toNamespacedPath(file)
      console.log('toNamespacedPath: ' + toNamespacedPath);
      if (toNamespacedPath.includes('.')) {
        console.log('this is not a folder');
      }
    })
    
    const dirname = path.dirname(dir)
    console.log('dirname: ' + dirname);
    let tree = `${prefix ? prefix + '/' : ''}${name}\n`;
    let fileNames: string[] = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (unwantedDirectories?.includes(file) || file === 'node_modules') {
            continue;
        }
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
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


}
