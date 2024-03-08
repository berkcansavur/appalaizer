#!/usr/bin/env node
const path = require('path')
import { ProjectTreeService } from './src/services'

const inputPath = process.cwd() // Input Directory
const outputDir = path.join(inputPath, 'docs') // Output Directory

const projectTreeService = new ProjectTreeService()
projectTreeService.generateProjectTree(inputPath, outputDir)

console.log('Project tree generated successfully.')
