import { FileHandler } from '../interfaces/file-handler.interface'
import * as fs from 'fs'
import { MarkdownService } from './markdown-file.service'
import { ErrorLogic, ProcessCouldNotSucced } from '../common'

export class DefaultFileService implements FileHandler {
  private readonly markdownService: MarkdownService

  constructor() {
    this.markdownService = new MarkdownService()
  }
  handleFile(filePath: string, outputDir: string): void {
    const content = fs.readFileSync(filePath, 'utf-8')
    const markdown = `Content:\n\`\`\`\n${content}\n\`\`\``
    this.markdownService.generateMarkdown(filePath, outputDir, markdown)
  }

  async writeAnalysisResultToFile(
    filePath: string,
    analysisResult: string,
  ): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const updatedContent = this.updateFileContent(fileContent, analysisResult)
      fs.writeFileSync(filePath, updatedContent, 'utf-8')
      console.log(`Analysis successfully saved to the file: ${filePath}`)
    } catch (error) {
      throw new ProcessCouldNotSucced('Writing analysis to file', ErrorLogic.errorProps(error));
    }
  }

  private updateFileContent(
    fileContent: string,
    analysisResult: string,
  ): string {
    const documentationHeader = 'Documentation:'
    const updatedContent = `${documentationHeader}\n${analysisResult}\n\n${fileContent}`
    return updatedContent
  }
}
