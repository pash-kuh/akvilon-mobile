/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig, mergeConfig } = require('metro-config');

module.exports = mergeConfig(async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig(__dirname);
    return {
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: false,
                },
            }),
        },
        resolver: {
            sourceExts: [...sourceExts, 'vue', 'ts', 'tsx', 'json'],
            assetExts: assetExts.filter((ext) => ext !== 'svg'),
        },
    };
})();
