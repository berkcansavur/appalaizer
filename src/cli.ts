import { DocumentationGenerator } from './documentation-generator';
import * as yargs from 'yargs';

// Komut satırı argümanlarını tanımla
const options = yargs
  .usage('Usage: -r <rootDir> -o <outputDir>')
  .option('r', { alias: 'rootDir', describe: 'Root directory for generating documentation', type: 'string', demandOption: true })
  .option('o', { alias: 'outputDir', describe: 'Output directory for generated documentation', type: 'string', demandOption: true })
  .argv;

// Belge oluşturucuyu oluştur ve belgelemeyi başlat
const generator = new DocumentationGenerator();
generator.generateDocumentation(options.rootDir as string, options.outputDir as string);
