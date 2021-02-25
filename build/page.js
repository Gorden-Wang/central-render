
/* eslint-disable @typescript-eslint/no-var-requires */

const process = require('process');
const path = require('path');
const semver = require('semver');
const chalk = require('chalk');
const fs = require('fs-extra');
// const fs = require('fs-extra');
const assert = require('assert');

const {
    getComponentListInfomation,
    getServerBundle,
} = require('./components.js');
const {
    requireUncached
} = require('./util');


const rootDir =  process.cwd();
const packageJson = path.join(rootDir, 'package.json');
const mockJson = path.join(rootDir, 'src/page/schema/mock.json');
const layout = path.join(rootDir,'src/page/layout/index.njk');

function getPageInfo() {
    const package = requireUncached(packageJson)
    const data = requireUncached(mockJson)
    const {
        version,
        name,
        entry,
    } = package;

    assert(semver.valid(version), chalk.red('Package.json version is invalid'))
    assert(name);

    const components = getComponentListInfomation();
    const combinedEntry = getEntries(components);

    return {
        name,
        version,
        data,
        components,
        combinedEntry,
        entry: {
            [`page/${name}/index`]: path.join(rootDir, `${entry}`)
        },
        layout: fs.readFileSync(layout,'utf8'),
    }
}


function extendsServerBundle(pageInfo,serverAsset = {}) {
    const {
        components,
    } = pageInfo;

    getServerBundle(components,serverAsset);
}

function getEntries(components) {
    const res = {
        client: {}, 
        server: {},
    };

    components.forEach(({
        entry
    }) => {
        const {
            client,
            server
        } = entry;

        Object.assign(res.client, client);
        Object.assign(res.server, server)
    })

    return res;


}


module.exports = {
    getPageInfo,
    extendsServerBundle,
    getEntries,
}