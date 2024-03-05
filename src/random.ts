import * as fs from 'fs';
import * as path from 'path';

function generateDocs(dirPath: string, outputDir: string) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
        const fileName = file.name;
        const filePath = path.join(dirPath, fileName);

        if (file.isDirectory()) {
            const markdown = generateMarkdown(filePath);
            const outputFileName = fileName + ".md";
            const outputPath = path.join(outputDir, "folders", outputFileName);
            fs.writeFileSync(outputPath, markdown);

            generateDocs(filePath, outputDir); // Alt klasörler için tekrar çağır
        } else {
            const content = fs.readFileSync(filePath, 'utf-8');
            const outputFileName = fileName + ".md";
            const outputPath = path.join(outputDir, "files", outputFileName);
            const markdown = `content:\n\`\`\`\n${content}\n\`\`\``;
            fs.writeFileSync(outputPath, markdown);
        }
    });

    // Giriş dosyası için .md dosyası oluştur
    const dirName = path.basename(dirPath);
    const markdown = generateMarkdown(dirPath);
    const outputFileName = dirName + ".md";
    const outputPath = path.join(outputDir, "folders", outputFileName);
    fs.writeFileSync(outputPath, markdown);
}

function generateMarkdown(dirPath: string,): string {
    let markdown = `Files:\n`;

    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    files.forEach(file => {
        const fileName = file.name;
        markdown += `- [[ ${fileName} ]]\n`;
    });

    markdown += "\n";
    return markdown;
}

const inputPath = './src'; // Burayı kendi projenize göre ayarlayın
const outputDir = './test-docs'; // Burayı kendi projenize göre ayarlayın

// Test-docs klasörünü oluştur (eğer yoksa)
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Dosya ve klasörleri oluştur
if (!fs.existsSync(path.join(outputDir, 'files'))) {
    fs.mkdirSync(path.join(outputDir, 'files'));
}

if (!fs.existsSync(path.join(outputDir, 'folders'))) {
    fs.mkdirSync(path.join(outputDir, 'folders'));
}

generateDocs(inputPath, outputDir);
