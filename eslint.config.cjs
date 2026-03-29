const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores(['dist/*']),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['babel.config.cjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
