import { FileHandler } from "../interfaces/file-handler.interface";
import * as fs from 'fs';
import * as path from 'path';

export class DefaultFileService implements FileHandler {
  handleFile(filePath: string, outputDir: string): void {
      const content = fs.readFileSync(filePath, 'utf-8');
      const outputFileName = path.basename(filePath) + ".md";
      const outputPath = path.join(outputDir, "files", outputFileName);
      const markdown = `Content:\n\`\`\`\n${content}\n\`\`\``;
      fs.writeFileSync(outputPath, markdown);
  }

  async writeAnalysisResultToFile(filePath: string, analysisResult: string): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const updatedContent = this.updateFileContent(fileContent, analysisResult);
      fs.writeFileSync(filePath, updatedContent, 'utf-8');
      console.log(`Analysis successfully saved to the file: ${filePath}`);
    } catch (error) {
      console.error('An error occurred while writing analysis result to file:', error);
      throw error;
    }
  }

  private updateFileContent(fileContent: string, analysisResult: string): string {
    const documentationHeader = 'Documentation:';
    const updatedContent = `${documentationHeader}\n${analysisResult}\n\n${fileContent}`;
    return updatedContent;
  }
}
