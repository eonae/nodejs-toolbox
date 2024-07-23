module.exports = {
  root: true,
  plugins: ['@rsdk/eslint-plugin'],
  extends: ['plugin:@rsdk/eslint-plugin/recommended'],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
