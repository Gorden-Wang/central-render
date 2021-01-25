/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const assert = require('assert');
const semver = require('semver');
const nunjucks = require('nunjucks');
const Tag = require('nunjucks-tag');

const rootDir =  process.cwd();
const packageJson = path.join(rootDir, 'package.json');
const mockJson = path.join(rootDir, 'mock.json');
const layoutNjk = fs.readFileSync(path.resolve(rootDir,'./src/layout/index.njk'),'utf8');

function isInProjectDir() {
    if (!fs.existsSync(packageJson) || !fs.existsSync(mockJson)) {
        throw new Error('请在项目内运行此命令')
    }
    getBasePackageInfo()
}

function getBasePackageInfo() {
    const package = requireUncached(packageJson)
    const data = requireUncached(mockJson)
    const {
        version,
        name,
    } = package;

    assert(semver.valid(version), chalk.red('Package.json version is invalid'))
    assert(name);

    return {
        name,
        version,
        data,
    }
    
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}


function extendsNunjucksTag() {
    const environment = nunjucks.configure({
        autoescape: true
    })

    environment.addExtension('ComponentsExtentions', new ComponentsExtentions());
    // environment.addExtension('ComponentsExtentions', new ComponentsExtentions());
    environment.addExtension('ComponentIncludeExtentions', new ComponentIncludeExtentions());
    return environment
}

class ComponentsExtentions extends Tag {
    constructor() {
      super('usecomponents');
      this.nodeName = 'div';
    }
    render(context, attrs, body) {
      // provide your custom logic
      return super.render(context, attrs, body());
    }
}

class ComponentIncludeExtentions extends Tag {
    constructor() {
      super('component');
      this.nodeName = 'div';
    }
    render(context, attrs, body) {
      return super.render(context, attrs, body());
    }
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
    getBasePackageInfo,
    requireUncached,
    extendsNunjucksTag,
    serializeServerBundle,
}
