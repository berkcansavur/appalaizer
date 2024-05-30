import { FileHandler } from '../../interfaces/file-handler.interface'
import * as fs from 'fs'
import { MarkdownService } from '../markdown-file.service'
import { ErrorLogic, ProcessCouldNotSucceed } from '../../common'
import { FileServiceFactory } from '../../factories/file-service.factory'
import { FileProperties } from '../../constants'
import * as path from 'path'
import { FileLogic } from 'logic/file'

export class BaseFileService implements FileHandler {
  private readonly markdownService: MarkdownService

  constructor() {
    this.markdownService = new MarkdownService()
  }

  async writeAnalysisResult(
    filePath: string,
    analysisResult: string,
  ): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const updatedContent = this.updateContent(fileContent, analysisResult)
      fs.writeFileSync(filePath, updatedContent, 'utf-8')
      console.log(`Analysis successfully saved to the file: ${filePath}`)
    } catch (error) {
      throw new ProcessCouldNotSucceed(
        'Writing analysis to file',
        ErrorLogic.errorProps(error),
      )
    }
  }

  private updateContent(fileContent: string, analysisResult: string): string {
    const documentationHeader = 'Documentation:'
    const updatedContent = `${documentationHeader}\n${analysisResult}\n\n${fileContent}`
    return updatedContent
  }

  getFileProperties(content: string, fileExtension: string): FileProperties {
    const fileService = FileServiceFactory.getHandler(fileExtension, content)
    return fileService.getFileProperties()
  }

  getExtension(filePath: string): string {
    const fileExtension = filePath.split('.').pop()?.toLowerCase() || ''
    return `.${fileExtension}`
  }

  formatProperties(fileProperties: FileProperties): string {
    let formattedContent = ''

    if (fileProperties.content) {
      formattedContent += `### Content\n\`\`\`\n${fileProperties.content}\n\`\`\`\n\n`
    }

    if (fileProperties.dependencies) {
      formattedContent += '### Dependencies\n'
      const { constructorDependencies, importedDependencies } =
        fileProperties.dependencies

      if (
        FileLogic.isConstructorDependenciesNotEmpty({ constructorDependencies })
      ) {
        formattedContent += `#### Constructor Dependencies\n${constructorDependencies.join('\n')}\n\n`
      }

      if (FileLogic.isImportedDependenciesNotEmpty({ importedDependencies })) {
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

  read(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8')
  }

  getContent(filePath: string): string {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return fileContent
    } catch (error) {
      console.error('An error occurred while reading file content:', error)
      return ''
    }
  }

  listFilesInDirectory(directoryPath: string): string[] {
    try {
      const files = fs.readdirSync(directoryPath)

      const filteredFiles = files.filter((file) => {
        const filePath = path.join(directoryPath, file)
        return fs.statSync(filePath).isFile()
      })

      return filteredFiles
    } catch (error) {
      console.error(
        'An error occurred while listing files in directory:',
        error,
      )
      return []
    }
  }

  handle(filePath: string, outputDir: string): void {
    const content = this.read(filePath)
    const fileExtension = this.getExtension(filePath)
    const fileProperties = this.getFileProperties(content, fileExtension)
    const markdown = this.formatProperties(fileProperties)
    this.markdownService.generateMarkdown(filePath, outputDir, markdown)
  }
}
