/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process');
const path = require('path');
const fs = require('fs-extra');

const rootDir =  process.cwd();
const packageJson = path.join(rootDir, 'package.json');

function isInProjectDir() {
    if (!fs.existsSync(packageJson)) {
        throw new Error('请在项目内运行此命令')
    }
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function serializeServerBundle({
    outputFileSystem, 
    assetsByChunkName, 
    outputPath
}) {

    const res = {}
    for(const [ key, value] of Object.entries(assetsByChunkName)) {
        res[key] = value.map(dir => {
            return outputFileSystem.readFileSync(path.join(outputPath,dir), 'utf8')
        })
    }

    return res;
}



module.exports = {
    isInProjectDir,
    requireUncached,
    serializeServerBundle,
}