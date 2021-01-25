/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const assert = require('assert');
const semver = require('semver');
const process = require('process');

const rootDir =  process.cwd();
function getComponentListInfomation() {
    const componentsRootDir = path.join(rootDir,'./src/components');
    const componentsDirLists = fs.readdirSync(componentsRootDir);
    return componentsDirLists.map(dir => {
        const d = path.join(componentsRootDir, dir);
        if(fs.statSync(d).isDirectory()) {
            return getComponentInfomation(d)
        }
        else
            console.warn(chalk.blue(`${d} 不是不符合component规范，建议删除`));
            return null
    }).filter(ob => !!ob)
    
}

function getComponentInfomation(dir) {
    // console.log(dir)
    const configDir = path.join(dir,'./config.json');
    const mockDataDir = path.join(dir, './schema/mock.json');
    assert(fs.existsSync(configDir) && fs.existsSync(mockDataDir), chalk.red(`${dir} 中必须包含config.json 和 schema/mock.json`))
    let config,mock;
    try {
         config = require(configDir);
         mock = require(mockDataDir);
    }catch(e) {
        console.error(chalk.red(`config 或 mock 不符合 JSON规范`))
    }

    const {
        name,
        version,
        entry
    } = config;

    assert(name, chalk.red('config中必须包含name字段'));
    assert(semver.valid(version), chalk.red('Package.json version is invalid'))
    assert(entry,chalk.red('config中必须包含entry字段'));
    const {
        client,
        server
    } = entry;


    const clientPath = path.join(dir,client[Object.keys(client)[0]]);
    const serverPath = path.join(dir,server[Object.keys(server)[0]]);
    assert(fs.existsSync(clientPath,chalk.red('client entry 不存在')))
    assert(fs.existsSync(serverPath,chalk.red('server entry 不存在')))

    return {
        name,
        version,
        data: mock,
        entry: {
            client: {
                [Object.keys(client)[0]]: clientPath
            },
            server: {
                [Object.keys(server)[0]]: serverPath
            }
        },
    }
}

function getTargetComponentByName(name,list) {
    assert(name, chalk.red('要调试的组件不能为空'))
    const target = list.filter(cpt => {
        return cpt.name === name;
    })[0]
    assert(target,chalk.red('要调试的组件不存在'));
    return target
}

module.exports = {
    getComponentListInfomation,
    getTargetComponentByName,
}


// console.log()
console.log(getComponentListInfomation())