export interface FileHandler {
  handleFile(filePath: string, outputDir: string): void;
}