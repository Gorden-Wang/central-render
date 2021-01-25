/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process')
const path = require('path')
const fs = require('fs-extra')
const request = require('request')

function getServerBundle(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath)
    }
    throw new Error('server bundle not found')
}

async function getRenderHTML(url,bundleString,buildInfo) {
    return new Promise((resolve,reject) =>{
        request.post(url, {
            form: {
                vueTemplate: bundleString,
                buildInfo: JSON.stringify(buildInfo)
            }
        }, function (err,httpResponse,body) {
            if (err) { reject(err) }
            resolve(body)
        })
    })
    
}

module.exports = {
    getRenderHTML,
    getServerBundle,
}