import '../props'
export class Red {
  private fileName: string
  private filePath: string
  constructor(fileName: string, filePath: string) {
    this.fileName = fileName
    this.filePath = filePath
  }

  getFileName(): string {
    return this.fileName
  }

  setFileName(fileName: string): void {
    this.fileName = fileName
  }

  getFilePath(): string {
    return this.filePath
  }
  setFilePath(filePath: string): void {
    this.filePath = filePath
  }
}
