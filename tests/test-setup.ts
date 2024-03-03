import * as fs from 'fs';

const outputDir = './test-output';
describe('Test Setup', () => {
  // Boş test
  test('Noop test', () => {
    // Hiçbir şey yapma
  });
});
beforeAll(() => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
});
