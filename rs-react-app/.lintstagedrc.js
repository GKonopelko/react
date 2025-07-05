export default {
  'src/**/*.{ts,tsx}': () => ['tsc -p tsconfig.app.json  --noEmit'],
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write', 'vitest related --run'],
  '*.css': ['stylelint --fix', 'prettier --write'],
  '!(*.{ts,tsx,css})': ['prettier --write --ignore-unknown'],
};
