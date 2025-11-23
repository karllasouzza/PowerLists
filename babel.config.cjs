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
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
