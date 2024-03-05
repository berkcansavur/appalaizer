import { FileHandler } from "../interfaces/file-handler.interface";
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownService } from "./markdown-file.service";
import { ProjectTreeService } from "./project-tree.service";

export class FolderHandler implements FileHandler {
  private readonly projectTreeService: ProjectTreeService
  private readonly markdownService: MarkdownService;

  constructor() {
      this.markdownService = new MarkdownService();
      this.projectTreeService = new ProjectTreeService();
  }

  handleFile(filePath: string, outputDir: string): void {
      const markdown = this.markdownService.generateMarkdown(filePath);
      const outputFileName = path.basename(filePath) + ".md";
      const outputPath = path.join(outputDir, "folders", outputFileName);
      fs.writeFileSync(outputPath, markdown);
      this.projectTreeService.generateProjectTree(filePath, outputDir);
  }
}