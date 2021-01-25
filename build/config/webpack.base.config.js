/* eslint-disable @typescript-eslint/no-var-requires */
const { VueLoaderPlugin } = require('vue-loader')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const fs = require('fs')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootDir = path.resolve(process.cwd())
const sassOptions = fs.readFileSync(path.join(rootDir, './src/css/index.scss'),'utf8');

const config = {
    output: {
        filename: '[name].js'
    },
    resolve: {
        // 将 `.ts` 添加为一个可解析的扩展名。
        extensions: ['.ts', '.js','.vue'],
        alias: {
          '~': path.join(rootDir,'src')
        }
    },
    stats: {
        colors: true
    },
    // externals: nodeExternals({
    //     // 不要外置化 webpack 需要处理的依赖模块。
    //     // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    //     // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    //     allowlist: /\.css$/
    // }),
    module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
}

function cssConfig(env = 'production', isServer = false) {
  let vueStyleLoader
  let plugins
  if (isServer === true || env === 'development') {
    vueStyleLoader = 'vue-style-loader'
    plugins = null
  } else {
    vueStyleLoader = MiniCssExtractPlugin.loader
    plugin = new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  }
  const loader = [{
    test: /\.scss$/,
    use: [
      vueStyleLoader,
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          additionalData: sassOptions
        }
      }
    ]
  },
  {
    test: /\.less$/,
    use: [
      vueStyleLoader,
      'css-loader',
      'less-loader'
    ]
  },
  {
    test: /\.css$/,
    use: [
      vueStyleLoader,
      {
        loader: 'css-loader',
        options: { importLoaders: 1,
          modules: true,
          // 自定义生成的类名
          // localIdentName: '[local]_[hash:base64:8]'
         }
      },
      'postcss-loader'
    ]
  }]
  return {
    loader,
    plugin,
  }
}
module.exports = {
  baseConfig: config,
  cssConfig,
}