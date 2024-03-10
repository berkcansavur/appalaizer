export class BaseError extends Error {
  constructor(public message: string, public path?:string, public code?:string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class FileNotFoundException extends BaseError {
  constructor(filePath: string) {
    super(`File not found at path: ${filePath}`);
    this.name = 'File not found exception';
  }
}
export class FolderNotFoundException extends BaseError {
  constructor(filePath: string) {
    super(`Folder not found at path: ${filePath}`);
    this.name = 'Folder not found exception';
  }
}
export class ProcessCouldNotSucced extends BaseError {
  constructor(operationName:string, message: string) {
    super(`Process ${operationName} could not succeed: ${message}`);
    this.name = 'Process could not succeed';
  }
}
export class RequestFailedException extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'Request failed exception';
  }
}
export class InvalidApiKeyError extends BaseError {
  constructor() {
    super('Invalid API key provided.');
    this.name = 'Invalid apiKey error';
  }
}
export class ExceededOpenaiQuotaException extends BaseError {
  constructor() {
    super('Invalid API key provided.');
    this.name = 'Exceeded openai quota exception';
    this.message = 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/'
  }
}
export class ApiKeyException extends BaseError {
  constructor() {
    super('API Key is not provided or invalid.');
    this.name = 'ApiKey error';
  }
}
export class OpenAIException extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAI error';
  }
}
