import * as fs from 'fs'
import * as path from 'path'
import { FileHandlerFactory } from '../factories/file-handler.factory'
import { DirectoryInfo } from '../constants/types'
import { ignoreList } from '../constants'

export class ProjectTreeService {
  generateProjectTree(inputPath: string, outputDir: string): void {
    this.createDocsStructure(outputDir)

    const map = this.createMap(inputPath)

    map.forEach(({ name, isFolder, realPath }) => {
      if (this.shouldIgnore(name)) return
      const outputItemPath = path.join(
        outputDir,
        isFolder ? 'folders' : 'files',
      )
      const fileHandler = FileHandlerFactory.getFileHandler(
        isFolder ? 'folder' : 'file',
      )
      fileHandler.handleFile(realPath, outputItemPath)
    })
  }

  createDocsStructure(outputDir: string): void {
    const filesPath = path.join(outputDir, 'files')
    const foldersPath = path.join(outputDir, 'folders')

    ;[filesPath, foldersPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  createMap(inputPath: string): Array<DirectoryInfo> {
    const map: DirectoryInfo[] = []
    const traverseDirectory = (currentPath: string) => {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })
      items.forEach((item) => {
        if (this.shouldIgnore(item.name)) return
        const itemPath = path.join(currentPath, item.name)
        map.push({
          name: item.name,
          isFolder: item.isDirectory(),
          realPath: itemPath,
        })

        if (item.isDirectory()) {
          traverseDirectory(itemPath)
        }
      })
    }

    traverseDirectory(inputPath)
    console.log('Map: ', map)
    return map
  }

  shouldIgnore(name: string): boolean {
    return ignoreList.includes(name)
  }
}
