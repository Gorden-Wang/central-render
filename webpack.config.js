const webpack = require('webpack')
const { client, server } = require('./config/index')
const chalk = require('chalk')
const fs = require('fs-extra')
const {
    getRenderHTML,
    getServerBundle
} = require('./build/render')

const compilers = [ webpack(client),webpack(server) ]

function compile(compiler,type) {
    compiler.run(async (err,stats) => {
        if (err) throw err
        console.log(chalk.green(`Start build ${type}`))
        process.stdout.write(stats.toString({
            colors: true,
            modules: true,
            children: false,
            chunks: true,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan(`  Build complete and use ${(stats.endTime - stats.startTime)/1000} seconds .\n`))
        if (type === 'server') {
            await afterServerCompile()
        }
        console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
        ))
    })
}
fs.removeSync('./dist')
compilers.forEach((com,index) => {
    compile(com,index===0 ? 'client' : 'server')
})


async function afterServerCompile () {
    console.log('================')
    const filePath = `${server.output.path}/${server.output.filename}`
    const string = getServerBundle(filePath)
    const html = await getRenderHTML('http://127.0.0.1:7001/vue-render/',string)
    console.log(html)
}