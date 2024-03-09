#!/usr/bin/env node
import { ConfigSetup } from '../config'
import { AnalysisService } from '../services/analysis.service'
import { GptService } from '../services/gpt.service'
import { ProjectTreeService } from '../services/project-tree.service'
import { DefaultFileService } from '../services/default-file.service'
import { PromptService } from '../services/prompt.service'

async function analyzeProjectFiles() {
  const configSetup = new ConfigSetup(new GptService())
  await configSetup.setApiKeyFromTerminal()
  await configSetup.setAIEngineFromTerminal()
  await configSetup.setAnalyzeLanguageFromTerminal()
  const gptService = new GptService()
  const projectPath = process.cwd()
  const analysisService = new AnalysisService(
    gptService,
    new ProjectTreeService(),
    new DefaultFileService(),
    new PromptService(gptService),
  )

  try {
    await analysisService.analyzeProjectFiles(projectPath)
  } catch (error) {
    console.error(`An error occurred: ${error}`)
  } finally {
    configSetup.closeReadline()
  }
}

async function runAnalysis() {
  try {
    await analyzeProjectFiles()
  } catch (error) {
    console.error('Error occurred during project analysis:', error)
    process.exit(1)
  }
}

runAnalysis()
