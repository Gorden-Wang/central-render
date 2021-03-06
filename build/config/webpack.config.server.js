/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')
const { baseConfig, cssConfig } = require('./webpack.base.config')
const { merge } = require('webpack-merge')

const rootDir = process.cwd();
const pkg = require(path.join(rootDir,'package.json'));
const dependencies = Object.keys(pkg.dependencies);

// dependencies.filter(dep => {
//     const list = {
//         vue: 'vue',
//         vuex: 'vuex',
//         '@klook/klook-ui': '@klook/klook-ui'
//     }
//     if (list[dep]) {
//         return false 
//     }

// });
const ENV = process.env.NODE_ENV
const cssConfigVo = cssConfig(ENV,true)
const webIgnore = nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    allowlist: (name) => {
        const list = {
            vue: 'vue',
            vuex: 'vuex',
            '@klook/klook-ui': '@klook/klook-ui'
        }
        console.log(name)
        if (list.name === name) {
            return false;
        }
        if (/\.css$/.test(name)) {
            return true
        }
        
    }

    // allowlist: [
    //     '@klook/klook-ui'
    // ]
})

const serverConfig = merge(baseConfig, {
    entry: './server.ts',
    target: 'node',
    output: {
        path: path.join(rootDir, `dist/server/${pkg.name}/${pkg.version}/`),
        libraryTarget: 'commonjs2'
    },
    mode: ENV === 'production' ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/], configFile: path.join(rootDir, 'tsconfig.server.json') }
              },
              ...cssConfigVo.loader,
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                isServer: true,
                isClient: true
            }
        })
    ],
    externals: webIgnore
})
module.exports = serverConfig