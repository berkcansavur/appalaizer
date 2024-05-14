import { FileHandler } from '../interfaces/file-handler.interface'
import * as fs from 'fs'
import { MarkdownService } from './markdown-file.service'
import { ErrorLogic, ProcessCouldNotSucceed } from '../common'
import { FileServiceFactory } from '../factories/file-service.factory'
import { FileProperties } from '../constants'

export class DefaultFileService implements FileHandler {
  private readonly markdownService: MarkdownService

  constructor() {
    this.markdownService = new MarkdownService()
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
      throw new ProcessCouldNotSucceed(
        'Writing analysis to file',
        ErrorLogic.errorProps(error),
      )
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

  private getFileExtension(filePath: string): string {
    const fileExtension = filePath.split('.').pop()?.toLowerCase() || ''
    return `.${fileExtension}`
  }

  private getFileProperties(content: string, filePath: string): FileProperties {
    console.log(`content:  ${JSON.stringify(content)}`)
    console.log(`filePath:  ${JSON.stringify(filePath)}`)
    const fileExtension = this.getFileExtension(filePath)
    const fileService = FileServiceFactory.getFileHandler(
      fileExtension,
      content,
    )
    console.log(`fileService:  ${JSON.stringify(fileService)}`)
    return fileService.getFileProperties()
  }

  formatFileProperties(fileProperties: FileProperties): string {
    let formattedContent = ''

    if (fileProperties.content) {
      formattedContent += `### Content\n\`\`\`\n${fileProperties.content}\n\`\`\`\n\n`
    }

    if (fileProperties.dependencies) {
      formattedContent += '### Dependencies\n'
      const { constructorDependencies, importedDependencies } =
        fileProperties.dependencies
      if (constructorDependencies.length > 0) {
        formattedContent += `#### Constructor Dependencies\n${constructorDependencies.join('\n')}\n\n`
      }
      if (importedDependencies.length > 0) {
        formattedContent += `#### Imported Dependencies\n${importedDependencies.join('\n')}\n\n`
      }
    }

    if (
      fileProperties.functionalities &&
      fileProperties.functionalities.length > 0
    ) {
      formattedContent += '### Functionalities\n'
      formattedContent +=
        fileProperties.functionalities.map((func) => `- ${func}`).join('\n') +
        '\n\n'
    }

    return formattedContent
  }

  handleFile(filePath: string, outputDir: string): void {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileProperties = this.getFileProperties(content, filePath)
    console.log('File Properties: ', JSON.stringify(fileProperties))
    let markdown
    if (fileProperties) {
      markdown = this.formatFileProperties(fileProperties)
    } else {
      markdown = `Content:\n\`\`\`\n${content}\n\`\`\``
    }

    console.log('Markdown: ', markdown)
    this.markdownService.generateMarkdown(filePath, outputDir, markdown)
  }
}
