export type DirectoryInfo = {
  name: string
  isFolder: boolean
  realPath: string
}
export const ignoreList = ['.DS_Store', 'docs', 'folders', 'files', 'node_modules']