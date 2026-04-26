// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // SECURITY: Enforce no raw console calls — use the safe logger instead.
    // SECURITY: Ban `any` types to prevent unsafe data flowing from API responses into the UI.
    rules: {
      // SECURITY: Prevents tokens, emails, and server errors from leaking into device logs
      'no-console': 'error',

      // SECURITY: Eliminates unsafe `any` assignments that bypass type-checking on API responses
      '@typescript-eslint/no-explicit-any': 'error',

      // SECURITY: Prevents values typed as `any` from silently spreading into typed variables
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
  },
]);
