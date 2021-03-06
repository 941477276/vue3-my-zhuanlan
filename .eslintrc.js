module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-extra-semi': "off",
    'no-unused-vars': 'off',
    'prefer-const': 'off',
    'no-trailing-spaces': 'off',
    'eqeqeq': 'off',
    'no-case-declarations': 'off',
    'no-unused-expressions': 'off',
    'no-useless-escape': 'off',
    'no-unneeded-ternary': 'off',
    'semi': ["error", "always"],
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/no-setup-props-destructure': 'off'
  }
}
