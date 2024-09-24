module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-transform-private-methods", { loose: true }],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-class-properties', {  loose: true }],
    ['react-native-reanimated/plugin', { globals: ['__scanCodes'] }],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          /**
           * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
           */
          '^@src/(.+)': './src/\\1',
          '^@/(.+)': './\\1',
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.json',
          '.tsx',
          '.ts',
          '.native.js',
        ],
      },
    ],
  ],
};
