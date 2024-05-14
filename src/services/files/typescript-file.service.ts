import { IFileService, IProgrammingFile } from 'interfaces'
import {
  Dependencies,
  DEPENDENCY_TYPES,
  FileProperties,
  Structs,
} from '../../constants'

export class TypeScriptFile implements IFileService, IProgrammingFile {
  private fileContent: string

  constructor(fileContent: string) {
    this.fileContent = fileContent
  }

  private findConstructorContent(): string | undefined {
    const lines = this.fileContent.split('\n')
    let constructorContent = ''
    let isInConstructor = false

    for (const line of lines) {
      const lowerCaseLine = line.toLowerCase()

      if (lowerCaseLine.includes('constructor')) {
        isInConstructor = true
      }

      if (isInConstructor) {
        constructorContent += line + '\n'

        if (lowerCaseLine.includes('}')) {
          break
        }
      }
    }

    if (!constructorContent) {
      return undefined
    }

    return constructorContent
  }

  private getConstructorDependencies(): string[] {
    const dependencies: Set<string> = new Set()
    const constructorContent = this.findConstructorContent()

    if (constructorContent) {
      const lines = constructorContent.split('\n')

      for (const line of lines) {
        const dependencyDeclarationRegex = /\bthis\.(\w+)/
        const match = line.match(dependencyDeclarationRegex)
        if (match) {
          const dependencyName = match[1]
          dependencies.add(dependencyName)
        }
      }
    }
    return [...dependencies]
  }

  private getImportedDependencies(): string[] {
    const dependencies: string[] = []

    const lines = this.fileContent.split('\n')

    for (const line of lines) {
      const parts = line.trim().split(' ')
      if (
        parts.length > 1 &&
        parts[0] === DEPENDENCY_TYPES.IMPORT &&
        parts[1].match(/[a-zA-Z_]+/)
      ) {
        dependencies.push(parts[1])
      }
    }

    return dependencies
  }

  getFunctionalities(): string[] {
    const functionDeclarations: Set<string> = new Set()

    const lines = this.fileContent.split('\n')

    for (const line of lines) {
      const functionDeclarationRegex = /(async\s+)?(function\s+)?(\w+)\s*\(/

      const match = line.match(functionDeclarationRegex)
      if (match) {
        const asyncKeyword = match[1] || ''
        const functionKeyword = match[2] || ''
        const functionName = match[3]
        if (functionName !== 'constructor') {
          const functionType = `${asyncKeyword}${functionKeyword}`.trim()
          const functionDeclaration = `${functionType} ${functionName}`

          functionDeclarations.add(functionDeclaration)
        }
        continue
      }
    }
    return [...functionDeclarations]
  }

  getDependencies(): Dependencies {
    const constructorDependencies = this.getConstructorDependencies()
    const importedDependencies = this.getImportedDependencies()
    const dependencies = {
      constructorDependencies,
      importedDependencies,
    }
    return dependencies
  }

  getFileProperties(): FileProperties {
    const dependencies = this.getDependencies()
    const functionalities = this.getFunctionalities()
    const fileProperties: FileProperties = {}
    const structs = this.getClassNamesAndTypes()

    if (
      dependencies.constructorDependencies.length > 0 ||
      dependencies.importedDependencies.length > 0
    ) {
      fileProperties.dependencies = dependencies
    }
    if (functionalities.length > 0) {
      fileProperties.functionalities = functionalities
    }
    if (this.fileContent) {
      fileProperties.content = this.fileContent
    }
    if (structs) {
      fileProperties.structs = structs
    }

    return fileProperties
  }

  getClassNamesAndTypes(): Structs {
    const struct: Structs = {}

    const lines = this.fileContent.split('\n')

    for (const line of lines) {
      const classDeclarationRegex =
        /\b((abstract|interface)\s+)?(class|interface|type)\s+(\w+)(?:\s+implements\s+([\w\s,]+))?/

      const match = line.match(classDeclarationRegex)
      if (match) {
        const isAbstractOrInterface = match[2] !== undefined
        const className = match[4]
        const implementedInterfaces = match[5]

        let classType = match[3]
        if (isAbstractOrInterface) {
          classType = match[2] + ' ' + classType
        }
        if (implementedInterfaces) {
          classType += ` implements ${implementedInterfaces}`
        }

        if (classType === 'class') {
          if (!struct.classes) struct.classes = []
          struct.classes.push(className)
        } else if (classType === 'interface') {
          if (!struct.interfaces) struct.interfaces = []
          struct.interfaces.push(className)
        } else if (classType === 'abstract class') {
          if (!struct.abstractClasses) struct.abstractClasses = []
          struct.abstractClasses.push(className)
        } else if (classType === 'type') {
          if (!struct.types) struct.types = []
          struct.types.push(className)
        }
      }
    }

    return struct
  }
}
