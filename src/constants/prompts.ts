export enum PROMPTS {
  FileAnalyze = 'Please explain the general purpose of this code file and its main functions.',
  DependencyAnalyze = 'Which external dependencies (libraries, modules, services, etc.) are used in this code file? Explain the role of each within the code.',
  ImprovementSuggestions = 'What potential improvements do you see in this code file? Please create a code example for each suggested improvement, including the current code block and the proposed change.',
  GeneralAnalyzeFromGPTConversation = 'Using the responses and information provided above, create a general assessment report about the code file.',
  SecurityVulnerabilitiesAnalyze = 'Are there any security vulnerabilities in the code? If so, please explain how these security vulnerabilities could be mitigated, listing the suggestions in detail.',
}

export const FILE_EXTENSION_PROMPT_PREFIX = 'In this file, which has a'
export const CONSTRUCTOR_DEPENDENCIES_PROMPT =
  'You will find a list of constructor dependencies:'
export const IMPORTED_DEPENDENCIES_PROMPT =
  'Here you will find a list of imported dependencies:'
export const STRUCTURES_PROMPT =
  'And this file contains the following structures:'
export const INTERFACE_PROMPT_PREFIX = '- Interfaces:'
export const CLASS_PROMPT_PREFIX = '- Classes:'
export const IMPROVEMENTS_PROMPT_PREFIX =
  'and share with me any possible improvements considering the overall structure of the code block.'
export const ABSTRACT_CLASS_PROMPT_PREFIX = '- Abstract Classes:'
export const TYPE_PROMPT_PREFIX = '- Types:'

export const importsPrompt = (importDependenciesText: string): string => {
  return `and here you will find a list of imported dependencies: ${importDependenciesText}.`
}
export const contentPrompt = (content: string): string => {
  return `Below is a file with the content: \n${content}\n\n`
}
export const extensionPrompt = (extension: string): string => {
  return `In this file, which has a ${extension} extension, `
}
export const constructorPrompt = (
  constructorDependenciesText: string,
): string => {
  return `you will find a list of constructor dependencies: ${constructorDependenciesText}.`
}
export const analyzePrompt = (functionalities: string): string => {
  return `Please analyze these dependencies along with the functionalities: ${functionalities} `
}
export const userContentPrompt = (userContent: string): string => {
  return `We're going to develop a new feature on this file. Here's what the scope of this feature will be: \n${userContent}`
}
export const featurePrompt = (language: string) => {
  return `When developing within this feature's scope, please adhere to the following guidelines: \n 1- Incorporate your changes into the existing code block \n 2- Append your modifications to the existing code block and return the entire code block. Your response should consist only of code, without any text \n 3- Do not disrupt any of the file's standard structures; simply add the necessary features within the feature's scope. And let me emphasize once again, you should only return the code block. If you think there's missing information needed for the feature to be developed, you should return it (only in this case, you can write text and suggestions in ${language}; otherwise, you should only share the added code changes).`
}
export const investigationPrompt = (fileContent: string) => {
  return `Before we start, I would like you to examine the structure I'm sharing with you which is: \n${fileContent}. \n When developing this feature, you should consider the classes, interfaces, types used in the code, as well as the specific features of the language. `
}
