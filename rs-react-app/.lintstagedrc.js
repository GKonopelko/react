export default {
  'src/**/*.{ts,tsx}': () => ['tsc -p tsconfig.app.json --noEmit'],
  'src/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'vitest related --run',
  ],
  'src/**/*.css': ['stylelint --fix', 'prettier --write'],
  '!(*.{ts,tsx,css})': ['prettier --write --ignore-unknown'],
};
