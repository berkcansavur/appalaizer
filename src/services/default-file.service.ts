import { FileHandler } from "../interfaces/file-handler.interface";
import * as fs from 'fs';
import * as path from 'path';

export class DefaultFileService implements FileHandler {
  handleFile(filePath: string, outputDir: string): void {
      const content = fs.readFileSync(filePath, 'utf-8');
      const outputFileName = path.basename(filePath) + ".md";
      const outputPath = path.join(outputDir, "files", outputFileName);
      const markdown = `content:\n\`\`\`\n${content}\n\`\`\``;
      fs.writeFileSync(outputPath, markdown);
  }
}