// .eslintrc.cjs
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {
        quotes: ['error', 'single']
    }
};