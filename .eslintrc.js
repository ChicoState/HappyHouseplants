module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
    'react',
    'react-native',
  ],
  rules: {
    'no-console': 0,
    'import/prefer-default-export': 'off'
  },
};
