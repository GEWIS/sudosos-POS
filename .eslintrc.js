module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'off', { allow: ['warn', 'error'] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': process.env.NODE_ENV === 'production' ? ['warn', 'unix'] : ['off', 'unix'],
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-param-reassign': ['error', { props: false }],
    'vue/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
    'no-underscore-dangle': 'off',
    'no-plusplus': [0, { allowForLoopAfterthoughts: true }],
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'warn',
    'no-await-in-loop': 'warn',
    'import/prefer-default-export': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
