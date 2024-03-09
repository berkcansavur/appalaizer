import * as fs from 'fs'
import * as path from 'path'
import { ignoreList } from '../constants';
export class MarkdownService {
  generateMarkdown(dirPath: string, outputDir: string, content: string): void {
    const folderName = path.basename(dirPath)
    if (ignoreList.includes(folderName)) {
      console.log(`Skipping markdown generation for ignored item: ${folderName}`);
      return;
    }
    const outputFileName = folderName + '.md'
    const outputPath = path.join(outputDir, outputFileName)
    fs.writeFileSync(outputPath, content)
  }
}
