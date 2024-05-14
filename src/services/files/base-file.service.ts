import { FileHandler } from '../../interfaces/file-handler.interface'
import * as fs from 'fs'
import { MarkdownService } from '../markdown-file.service'
import { ErrorLogic, ProcessCouldNotSucceed } from '../../common'
import { FileServiceFactory } from '../../factories/file-service.factory'
import { FileProperties } from '../../constants'

export class BaseFileService implements FileHandler {
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

  getFileProperties(content: string, fileExtension: string): FileProperties {
    const fileService = FileServiceFactory.getFileHandler(
      fileExtension,
      content,
    )
    return fileService.getFileProperties()
  }

  getFileExtension(filePath: string): string {
    const fileExtension = filePath.split('.').pop()?.toLowerCase() || ''
    return `.${fileExtension}`
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

    if (fileProperties.structs) {
      const { interfaces, classes, abstractClasses, types } =
        fileProperties.structs
      formattedContent += '### Structures\n'
      if (interfaces && interfaces.length > 0) {
        formattedContent += `#### Interfaces\n${interfaces.join('\n')}\n\n`
      }
      if (classes && classes.length > 0) {
        formattedContent += `#### Classes\n${classes.join('\n')}\n\n`
      }
      if (abstractClasses && abstractClasses.length > 0) {
        formattedContent += `#### Abstract Classes\n${abstractClasses.join('\n')}\n\n`
      }
      if (types && types.length > 0) {
        formattedContent += `#### Types\n${types.join('\n')}\n\n`
      }
    }

    return formattedContent
  }

  handleFile(filePath: string, outputDir: string): void {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileExtension = this.getFileExtension(filePath)
    const fileProperties = this.getFileProperties(content, fileExtension)
    console.log('File Properties: ', JSON.stringify(fileProperties))
    const markdown = this.formatFileProperties(fileProperties)

    console.log('Markdown: ', markdown)
    this.markdownService.generateMarkdown(filePath, outputDir, markdown)
  }
}
