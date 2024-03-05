import { ProjectTreeService } from '../src/services';
import * as path from 'path';

const inputPath = path.join(__dirname, '../src'); // Giriş dizini
const outputDir = path.join(__dirname, './docs'); // Çıkış dizini
const projectTreeService = new ProjectTreeService();
projectTreeService.generateProjectTree(inputPath, outputDir);
