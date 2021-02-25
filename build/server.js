/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const {client,server} = require('./config/index');
const {type: devType, info: devInfo, allComponents: components,target } = require('./devType.js');
const {
  getPageInfo
} = require('./page');

function getCompiler(type,info) {
    
    if (type === 'component') {
        return {
            serverCompiler: webpack(server({
                entry: info.entry.server
            })), 
            clientCompiler: webpack(client({
                entry: info.entry.client
            }))
        }
    }else {
      const {combinedEntry,entry: pageEntry} = getPageInfo();
      const generatEntry = function (type) {
        return {...combinedEntry[type]}
      }
      return {
        serverCompiler: webpack(server({
          entry: generatEntry('server')
        })),
        clientCompiler: webpack(client({
          entry: {
            ...generatEntry('client'),
            ...pageEntry
          }

        }))
      }
    }
}
const {serverCompiler, clientCompiler} = getCompiler(devType,devInfo)

const {
  isInProjectDir,
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
  const baseInfo = getPageInfo();
  const buildInfo = {
    ...baseInfo,
    devType,
    target,
    devInfo: {
      ...devInfo,
      serverBundle,
    },
    serverBundle,
    components,
    client: {
      outputPath: res.clientAsset.outputPath,
      assetsByChunkName: res.clientAsset.assetsByChunkName
    },
  }

  console.log(buildInfo.components[0].entry.client)

  if (devType === 'component') {
    const html = await getRenderHTML('http://127.0.0.1:7001/tetrisapi/vue-render/',buildInfo,req.headers);
    res.send(html);
  }else {
    const html = await getRenderHTML('http://127.0.0.1:7001/tetrisapi/vue-render-page/',buildInfo,req.headers);
    res.send(html);
  }
  
  
});

app.listen(3000);