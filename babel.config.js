module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Add the reanimated plugin here for proper native setup
      "react-native-reanimated/plugin",  // This should be the last plugin
    ],
  };
};
