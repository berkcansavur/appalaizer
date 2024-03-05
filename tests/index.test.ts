const { DocumentationGenerator } = require('../src/documentation-generator');
import * as fs from 'fs';

describe('Documentation Generator Tests', () => {
  test('Generate Documentation Test', () => {
    const generator = new DocumentationGenerator();
    generator.generateDocumentation('../src', './test-output');

    // Oluşturulan belgelerin varlığını kontrol et
    expect(fs.existsSync('./test-output')).toBe(true);

    // İlgili belge dosyalarının varlığını kontrol et
    expect(fs.existsSync('./test-output/index.ts.md')).toBe(true);
    expect(fs.existsSync('./test-output/cli.ts.md')).toBe(true);
    expect(fs.existsSync('./test-output/documentation-generator.ts.md')).toBe(true);
    // expect(fs.existsSync('./test-output/utils')).toBe(true);
  });
});
