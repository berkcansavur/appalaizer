import { FileHandler } from "../interfaces/file-handler.interface";
import * as fs from 'fs';
import { MarkdownService } from "./markdown-file.service";

export class FolderHandler implements FileHandler {
  private readonly markdownService: MarkdownService;

  constructor() {
      this.markdownService = new MarkdownService();
  }

  handleFile(filePath: string, outputDir: string): void {
    const content = this.createFolderContent(filePath);
    this.markdownService.generateMarkdown(filePath, outputDir,content); 
  }
  createFolderContent(filePath: string): string {
    let content = `Files:\n`;
    console.log('createFolderContent filePath: ',filePath);
    const files = fs.readdirSync(filePath, { withFileTypes: true });
      files.forEach(file => {
        const fileName = file.name;
        content += `- [[ ${fileName} ]]\n`;
    });
    content += "\n";
    return content;
  }
}

