const { DocumentationGenerator } = require('../src/documentation-generator');
import * as fs from 'fs';

describe('Documentation Generator Tests', () => {
  test('Generate Documentation Test', () => {
    const generator = new DocumentationGenerator();
    generator.generateDocumentation('./src', './test-output');

    // Oluşturulan belgelerin varlığını kontrol et
    expect(fs.existsSync('./test-output')).toBe(true);

    // İlgili belge dosyalarının varlığını kontrol et
    expect(fs.existsSync('./test-output/index.md')).toBe(true);
    expect(fs.existsSync('./test-output/cli.md')).toBe(true);
    expect(fs.existsSync('./test-output/models')).toBe(true);
    expect(fs.existsSync('./test-output/utils')).toBe(true);
  });
});
