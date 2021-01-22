/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const assert = require('assert');
const semver = require('semver');
const nunjucks = require('nunjucks');

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

    environment.addExtension('RemoteExtension', new RemoteExtension());
    environment.addExtension('ComponentsExtentions', new ComponentsExtentions());
    // environment.addExtension('ComponentIncludeExtentions', new ComponentIncludeExtentions());
    return environment
}
function RemoteExtension() {
    this.tags = ['remote'];

    this.parse = function (parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        // console.log(parser.advanceAfterBlockEnd(tok.value));
        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('error', 'endtruncate');
        var errorBody = null;

        if(parser.skipSymbol('error')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endremote');
        }

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
    };

    this.run = function (context, url, body, errorBody) {
        var id = 'el' + Math.floor(Math.random() * 10000);
        var ret = new nunjucks.runtime.SafeString('<div id="' + id + '">' + body() + '</div>');
        // var ajax = new XMLHttpRequest();

        // ajax.onreadystatechange = function () {
        //     if(ajax.readyState == 4) {
        //         if(ajax.status == 200) {
        //             document.getElementById(id).innerHTML = ajax.responseText;
        //         }
        //         else {
        //             document.getElementById(id).innerHTML = errorBody();
        //         }
        //     }
        // };

        // ajax.open('GET', url, true);
        // ajax.send();

        console.log(url,body(),errorBody());

        return ret;
    };
}


function ComponentsExtentions() {
    this.tags = ['usecomponents','component']
    this.parse = function (parser,nodes) {
        var tok = parser.nextToken();
        console.log(tok)
        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = []
        console.log(args)
        parser.advanceAfterBlockEnd(tok.value);
        // console.log(parser.advanceAfterBlockEnd(tok.value));
        // parse the body and possibly the error block, which is optional
        var errorBody
        if(parser.skipSymbol('component')) {
            args.push(parser.parseSignature(null, true));
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endcomponent');
        }


        // if (tok.value('component')) {
        //     var body = parser.parseUntilBlocks('component', 'endcomponent');
        // }
        var body = parser.parseUntilBlocks('usecomponents', 'endusecomponents');
        parser.advanceAfterBlockEnd();
        console.log(body)

        // if(parser.skipSymbol('error')) {
        //     parser.skip(lexer.TOKEN_BLOCK_END);
        //     errorBody = parser.parseUntilBlocks('endusecomponents');
        // }
        return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
    }
    this.run = function (context,body,errorBody) {
        console.log(1111,body())
        return '1111'
    }
}

// function ComponentIncludeExtentions() {
//     this.tags = ['usecomponents']
//     this.parse = function (parser,nodes) {
//         var tok = parser.nextToken();

//         // parse the args and move after the block end. passing true
//         // as the second arg is required if there are no parentheses
//         var args = parser.parseSignature(null, true);
//         parser.advanceAfterBlockEnd(tok.value);
//         // console.log(parser.advanceAfterBlockEnd(tok.value));
//         // parse the body and possibly the error block, which is optional
//         var body = parser.parseUntilBlocks('usecomponents', 'endusecomponents');
//         parser.advanceAfterBlockEnd();
//         var errorBody = null;
//         console.log(body)

//         // if(parser.skipSymbol('error')) {
//         //     parser.skip(lexer.TOKEN_BLOCK_END);
//         //     errorBody = parser.parseUntilBlocks('endusecomponents');
//         // }
//         return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
//     }
//     this.run = function (context,body,errorBody) {
//         console.log(1111,body())
//         return '1111'
//     }
// }
module.exports = {
    isInProjectDir,
    getBasePackageInfo,
    requireUncached,
    extendsNunjucksTag,
}


const nun = extendsNunjucksTag().renderString(layoutNjk)

// console.log(nun)