Content:
```
import { ProjectTreeService } from '../src/services';
import * as path from 'path';

const inputPath = path.join(__dirname, './'); // Input Directory
const outputDir = path.join(__dirname, './docs'); // Output Directory
const projectTreeService = new ProjectTreeService();
projectTreeService.generateProjectTree(inputPath, outputDir);

```