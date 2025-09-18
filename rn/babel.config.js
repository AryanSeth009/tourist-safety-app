module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			// Use worklets plugin (migrated from react-native-reanimated/plugin)
			'react-native-worklets/plugin',
		],
	}
}


