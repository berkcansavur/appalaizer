export interface FileHandler {
  handle(filePath: string, outputDir: string): void
}
