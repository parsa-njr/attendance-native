const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// فقط android و ios رو فعال کن
config.resolver.platforms = ['android', 'ios'];

module.exports = withNativeWind(config, { input: './global.css' });
