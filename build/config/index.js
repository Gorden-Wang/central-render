/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const clientConfig = require('./webpack.config.client.js');
const serverConfig = require('./webpack.config.server');

function extendsConfig(baseConfig) {
    return (extendsConfig) => {
        if(typeof extendsConfig === 'object') {
            return merge(baseConfig,extendsConfig)
        }
        return baseConfig
    }
}

module.exports = {
    client: extendsConfig(clientConfig),
    server: extendsConfig(serverConfig),
}