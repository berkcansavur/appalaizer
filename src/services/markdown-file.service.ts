import * as fs from 'fs'
import * as path from 'path'
export class MarkdownService {
  generateMarkdown(dirPath: string, outputDir: string, content: string): void {
    const folderName = path.basename(dirPath)
    const outputFileName = folderName + '.md'
    const outputPath = path.join(outputDir, outputFileName)
    fs.writeFileSync(outputPath, content)
  }
}
