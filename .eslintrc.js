module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react'],
  extends: ['plugin:prettier/recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['**/lib/*'],
  settings: {
    react: {
      version: '17',
    },
  },
  rules: {
    'no-console': 'error',
    'react/prop-types': 'off',
  },
}
