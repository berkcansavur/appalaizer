#!/usr/bin/env node
import { ConfigSetup } from './src/config';
import { AnalysisService } from './src/services/analysis.service';
import { GptService } from './src/services/gpt.service';
import { ProjectTreeService } from './src/services/project-tree.service';
import { DefaultFileService } from './src/services/default-file.service';

async function analyzeProjectFiles() {
  await ConfigSetup.setApiKeyFromTerminal();

  const projectPath = process.cwd();
  const analysisService = new AnalysisService(
    new GptService(),
    new ProjectTreeService(),
    new DefaultFileService()
  );
  await analysisService.analyzeProjectFiles(projectPath).then(()=> {
    console.log('analyze is completed');
  }).catch((error) => {
    console.log(`An error is occurred: ${error}`)
  })
}

async function runAnalysis() {
  try {
    await analyzeProjectFiles(); 
    console.log('Analysing of project files is done successfully.');
  } catch (error) {
    console.error('Error occurred during project analysis:', error);
    process.exit(1);
  }
}

runAnalysis();
