import { BaseError } from 'common/exceptions'

export class ErrorLogic {
  static isFileNotFound(error: unknown): boolean {
    const customError = error as BaseError
    if (customError.path && customError.path.includes('apikeys.txt')) {
      return true
    }
    return false
  }
  static isNoEntityError(error: unknown): boolean {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return true
    }
    return false
  }
  static isErrorHasMessage(error: unknown): boolean {
    return error instanceof Error && !!error.message
  }
  static errorProps(error: any) {
    return (
      error.response?.data?.error?.message ||
      error.message ||
      'Unknown error occurred'
    )
  }
}
