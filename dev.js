const express = require('express');
const path = require('path');
const MemoryFileSystem = require('memory-fs')
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const isObject = require('is-object');
const { client, server } = require('./config/index')
const app = express();
const serverCompiler = webpack(server);
const clientCompiler = webpack(client);

const {
  isInProjectDir,
  getBasePackageInfo
} = require('./build/util');
const {
  getRenderHTML,
  getServerBundle
} = require('./build/render')

function normalizeAssets(assets) {
  if (isObject(assets)) {
    return Object.values(assets);
  }

  return Array.isArray(assets) ? assets : [assets];
}

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
  const {
    outputPath,
    assetsByChunkName,
    outputFileSystem
  } = res.serverAsset;
  const baseInfo = getBasePackageInfo();
  const buildInfo = {
    ...baseInfo,
    client: {
      outputPath: res.clientAsset.outputPath,
      assetsByChunkName: res.clientAsset.assetsByChunkName
    }
  }

  outputFileSystem.readFile(`${outputPath}${assetsByChunkName.main[0]}`, async (err,data) => {
    const html = await getRenderHTML('http://127.0.0.1:7001/vue-render/',data.toString(),buildInfo)
    res.send(html);
  })
  
});

app.listen(3000);