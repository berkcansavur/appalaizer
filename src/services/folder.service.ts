import { FileHandler } from "../interfaces/file-handler.interface";
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownService } from "./markdown-file.service";

export class FolderHandler implements FileHandler {
  private readonly markdownService: MarkdownService;

  constructor() {
      this.markdownService = new MarkdownService();
  }

  handleFile(filePath: string, outputDir: string): void {
      const markdown = this.markdownService.generateMarkdown(filePath);
      const outputFileName = path.basename(filePath) + ".md";
      const outputPath = path.join(outputDir, "folders", outputFileName);
      fs.writeFileSync(outputPath, markdown);
  }
}