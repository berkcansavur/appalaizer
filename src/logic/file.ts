export class FileLogic {
  static isImportedDependenciesNotEmpty({
    importedDependencies,
  }: {
    importedDependencies: string[]
  }): boolean {
    return importedDependencies.length > 0
  }
  static isConstructorDependenciesNotEmpty({
    constructorDependencies,
  }: {
    constructorDependencies: string[]
  }): boolean {
    return constructorDependencies.length > 0
  }
}
