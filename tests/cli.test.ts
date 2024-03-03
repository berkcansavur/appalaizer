const { DocumentationGenerator } = require('../src/documentation-generator');
import * as yargs from 'yargs';
import { mocked } from 'ts-jest/utils';
import * as fs from 'fs';

// DocumentationGenerator mock'u oluştur
jest.mock('../src/documentation-generator');

// yargs.argv mock'u oluştur
jest.mock('yargs', () => ({
  usage: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  argv: {
    rootDir: './src',
    outputDir: './test-output'
  }
}));

describe('CLI Tests', () => {
  test('CLI Test', () => {
    // CLI komutu çağrıldığında belge oluşturmanın tetiklenmesini kontrol et
    require('../src/cli');
    const generatorMock = mocked(DocumentationGenerator, true);
    expect(generatorMock).toHaveBeenCalledWith();
    expect(generatorMock.prototype.generateDocumentation).toHaveBeenCalledWith('./src', './test-output');
  });
});
