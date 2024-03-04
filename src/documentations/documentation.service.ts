export class DocumentationService {
  generateDocumentationContent(fileName: string): string {
      return `# ${fileName}\n\n`;
  }
}