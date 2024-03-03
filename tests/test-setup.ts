import * as fs from 'fs';

const outputDir = './test-output';

beforeAll(() => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
});
