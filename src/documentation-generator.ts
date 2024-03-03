import * as fs from 'fs';
import * as path from 'path';

export class DocumentationGenerator {
  generateDocumentation(rootDir: string, outputDir: string) {
    const tree = this.generateTree(rootDir);
    this.createMarkdownFiles(tree, outputDir);
  }

  private generateTree(rootDir: string): string {
    const tree = this.generateDirectoryTree(rootDir, '');
    return tree;
  }

  private generateDirectoryTree(dir: string, prefix: string): string {
    const name = path.basename(dir);
    const files = fs.readdirSync(dir);
    let tree = `${prefix ? prefix + '/' : ''}${name}\n`;

    for (const file of files) {
      const filePath = path.join(dir, file);
      if (file === 'node_modules') {
        continue;
      }
      if (fs.statSync(filePath).isDirectory()) {
        tree += this.generateDirectoryTree(filePath, `${prefix}  `);
      } else {
        tree += `${prefix}  ${file}\n`;
      }
    }

    return tree;
  }

  private createMarkdownFiles(tree: string, outputDir: string) {
    const lines = tree.split('\n');
    let currentDir = outputDir;

    for (const line of lines) {
      const isDirectory = line.endsWith('/');
      const name = isDirectory ? line.slice(0, -1) : line;

      if (isDirectory) {
        currentDir = path.join(currentDir, name);
        if (!fs.existsSync(currentDir)) {
          fs.mkdirSync(currentDir, { recursive: true });
        }
      } else {
        const filePath = path.join(currentDir, name + '.md');
        fs.writeFileSync(filePath, `# ${name}\n\n`);
      }
    }
  }
}
