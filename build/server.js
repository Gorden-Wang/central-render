/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const {client,server} = require('./config/index');
const {type: devType, info: devInfo, allComponents: components } = require('./devType.js');

function getCompiler(type,info) {
    console.log(11111,info);
    if (type === 'component') {
        return {
            serverCompiler: webpack(server({
                entry: info.entry.server
            })), 
            clientCompiler: webpack(client({
                entry: info.entry.client
            }))
        }
    }
}
const {serverCompiler, clientCompiler} = getCompiler(devType,devInfo)

const {
  isInProjectDir,
  getBasePackageInfo,
  serializeServerBundle,
} = require('./util');
const {
  getRenderHTML,
} = require('./render')


isInProjectDir();

app.use(async (req,res,next) => {
  if (req.path.endsWith('ico')) {
    res.status(200);
    res.type('image/x-icon');
    res.send('')
    return
  }

  await next();
})

app.use(webpackDevMiddleware(clientCompiler, {
  stats: {
    colors: true
  },
  serverSideRender: true
}));

app.use(async (req,res,next) => {
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware.outputFileSystem;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;
  res.clientAsset = {assetsByChunkName,outputPath,outputFileSystem}
  await next()
})


app.use(webpackDevMiddleware(serverCompiler, {
  stats: {
    colors: true
  },
  serverSideRender: true
}));

app.use(async (req,res,next) => {
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware.outputFileSystem;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;
  res.serverAsset = {assetsByChunkName,outputPath,outputFileSystem}
  await next()
})
// client response
app.use(async (req,res,next) => {
  const {
    outputPath,
    assetsByChunkName,
    outputFileSystem
  } = res.clientAsset;
  console.log(outputPath,assetsByChunkName)
  if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
    
    const fileUrl = path.join(outputPath,req.path)
    outputFileSystem.readFile(fileUrl, async (err,data) => {
      if (err) {
        res.status(404);
        res.end();
        return;
      }
      if (req.url.endsWith('.js')) {
        res.type('application/javascript');
      }
      if (req.url.endsWith('.css')) {
        res.type('text/css')
      }
      res.send(data.toString())
    })
    return
    
  }
  await next()
})
app.use(async (req,res) => {
  const serverBundle = serializeServerBundle(res.serverAsset)
  const baseInfo = getBasePackageInfo();
  const buildInfo = {
    ...baseInfo,
    devType,
    devInfo: {
      ...devInfo,
      serverBundle,
    },
    components,
    client: {
      outputPath: res.clientAsset.outputPath,
      assetsByChunkName: res.clientAsset.assetsByChunkName
    },
  }

  const html = await getRenderHTML('http://127.0.0.1:7001/tetrisapi/vue-render/',null,buildInfo)
  res.send(html);
  
});

app.listen(3000);