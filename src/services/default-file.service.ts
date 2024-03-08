import { FileHandler } from '../interfaces/file-handler.interface'
import * as fs from 'fs'
import { MarkdownService } from './markdown-file.service'

export class DefaultFileService implements FileHandler {
  private readonly markdownService: MarkdownService

  constructor() {
    this.markdownService = new MarkdownService()
  }
  handleFile(filePath: string, outputDir: string): void {
    console.log('FilePath: ' + filePath, 'OutputDir: ' + outputDir)
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
      console.error(
        'An error occurred while writing analysis result to file:',
        error,
      )
      throw error
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
