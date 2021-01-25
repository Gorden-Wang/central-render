/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { baseConfig,cssConfig } = require('./webpack.base.config')
const { merge } = require('webpack-merge')

const rootDir = process.cwd();
const pkg = require(path.join(rootDir,'package.json'));

const ENV = process.env.NODE_ENV;

const webIgnore = {
    vue: 'vue',
    vuex: 'vuex',
    'klook-ui': '@klook/klook-ui',
    'vue-property-decorator': 'vue-property-decorator'
}
const cssConfigVo = cssConfig(ENV)
const clientConfig = merge(baseConfig, {
    entry: path.join(rootDir, './client.ts'),
    output: {
        path: path.join(rootDir, `dist/client/${pkg.name}/${pkg.version}/`),
        publicPath: '/'
    },
    mode: ENV === 'production' ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /(\.tsx?)$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/], configFile: path.join(rootDir, 'tsconfig.json') }
            },
            ...cssConfigVo.loader
        ]
    },
    plugins: [
        cssConfigVo.plugin
    ]
    // externals: webIgnore
})
module.exports = clientConfig