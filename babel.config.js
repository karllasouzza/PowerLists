module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    env: {
      production: {
        plugins: [
          [
            'module:react-native-dotenv',
            {
              envName: 'APP_ENV',
              moduleName: '@env',
              path: '.env',
            },
          ],
        ],
      },
    },

    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
