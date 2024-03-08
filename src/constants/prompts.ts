export enum PROMPTS {
  FileAnalyze = 'Please explain the general purpose of this code file and its main functions.',
  DependencyAnalyze = 'Which external dependencies (libraries, modules, services, etc.) are used in this code file? Explain the role of each within the code.',
  ImprovementSuggestions = 'What potential improvements do you see in this code file? Please create a code example for each suggested improvement, including the current code block and the proposed change.',
  GeneralAnalyzeFromGPTConversation = 'Using the responses and information provided above, create a general assessment report about the code file.',
  SecurityVulnerabilitiesAnalyze = 'Are there any security vulnerabilities in the code? If so, please explain how these security vulnerabilities could be mitigated, listing the suggestions in detail.',
}
