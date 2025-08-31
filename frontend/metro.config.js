// metro.config.js (en la raíz del proyecto)
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Alias para que Metro use la build ESM de tslib en web
const ALIASES = {
  tslib: require.resolve('tslib/tslib.es6.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const mapped = ALIASES[moduleName] ?? moduleName;
  return (originalResolveRequest ?? context.resolveRequest)(
    context,
    mapped,
    platform
  );
};

module.exports = config;
