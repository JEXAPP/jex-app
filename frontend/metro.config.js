// metro.config.js (en la raíz del proyecto)
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Alias que forcean módulos a resolverse a versiones compatibles con RN
const ALIASES = {
  tslib: require.resolve('tslib/tslib.es6.js'),
  path: require.resolve('path-browserify'), // 👈 clave para mime-types
};

// Conserva tu resolveRequest y suma el alias de 'path'
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const mapped = ALIASES[moduleName] ?? moduleName;
  return (originalResolveRequest ?? context.resolveRequest)(context, mapped, platform);
};

module.exports = config;
