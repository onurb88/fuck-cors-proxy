'use strict'

const http = require('http')
const https = require('https')

const proxyParse = req => {
    
    let { host, path } = req.params
    let secure = false
    
    console.log('PROXY\n', 'HOST', host, '\n', 'PATH', path)
    
    if (host.startsWith('http://'))
        host = host.replace('http://', '')
    
    if (host.startsWith('https://')) {
        host = host.replace('https://', '')
        secure = true
    }
    
    // FUCK self-signed certs
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    
    return { host, path, secure }
    
}

const httpReq = (method, host, path, secure, data) => {
    
    return new Promise((resolve, reject) => {
        
        const options = {
            method,
            host,
            path
        }
        
        const payload = !data ? null : (typeof data === 'object')
            ? JSON.stringify(data) : data.toString()
        
        const done = res => {
            let str = ''
            res.setEncoding('utf8')
            res.on('data', chunk => { str += chunk })
            res.on('end', () => {
                try {
                    const obj = JSON.parse(str)
                    resolve(obj)
                }
                catch (e) {
                    console.error('Error: response doesn\'t look like JSON:\n' +
                        str.substring(0, 100), '...')
                    // reject(e)
                    resolve(str)
                }
            })
        }
        
        let req
        if (secure) req = https.request(options, done)
        else req = http.request(options, done)
        
        if (['PUT', 'POST'].includes(method.toUpperCase()))
            req.end(payload)
        else
            req.end()
        
    })
    
}

const httpGet = (host, path, secure) => httpReq('GET', host, path, secure)
const httpPut = (host, path, secure, data) => httpReq('PUT', host, path, secure, data)
const httpPost = (host, path, secure, data) => httpReq('POST', host, path, secure, data)
const httpDel = (host, path, secure) => httpReq('DELETE', host, path, secure)

module.exports.proxyParse = proxyParse
module.exports.httpGet = httpGet
module.exports.httpPut = httpPut
module.exports.httpPost = httpPost
module.exports.httpDel = httpDel
