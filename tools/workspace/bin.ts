import path from 'node:path';

import { run } from './src/run';

const code = run(process.argv.slice(2), {
  root: path.resolve(__dirname, '../..'),
  log: (message) => {
    console.log(message);
  },
  error: (message) => {
    console.error(message);
  },
});

process.exit(code);
