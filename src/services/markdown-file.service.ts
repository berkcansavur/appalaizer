import * as fs from 'fs';
export class MarkdownService {
  generateMarkdown(dirPath: string): string {
      let markdown = `Files:\n`;
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      files.forEach(file => {
        const fileName = file.name;
        markdown += `- [[ ${fileName} ]]\n`;
      });
      markdown += "\n";
      return markdown;
  }
}