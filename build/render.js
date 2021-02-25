/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs-extra')
const request = require('request')

function getServerBundle(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath)
    }
    throw new Error('server bundle not found')
}

async function getRenderHTML(url,buildInfo,headers) {
    return new Promise((resolve,reject) =>{
        request.post(url, {
            form: {
                buildInfo: JSON.stringify(buildInfo)
            },
            headers,
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