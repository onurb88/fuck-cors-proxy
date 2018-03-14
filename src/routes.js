const fs = require('fs')
const path = require('path')
const app = require('./app')
const { httpGet, httpPut, httpPost, httpDelete } = require('./lib/utils')

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

app.get(`/:host/:path`, (req, res) => {
    const { host, path, secure } = proxyParse(req)
    httpGet(host, path, secure)
        .then(result => res.send(200, result))
        .catch(err => {
            console.error(err)
            res.send(500, err)
        })
})

app.put(`/:host/:path`, (req, res) => {
    const { host, path, secure } = proxyParse(req)
    httpPut(host, path, secure, req.body)
        .then(result => res.send(200, result))
        .catch(err => {
            console.error(err)
            res.send(500, err)
        })
})

app.post(`/:host/:path`, (req, res) => {
    const { host, path, secure } = proxyParse(req)
    httpPost(host, path, secure, req.body)
        .then(result => res.send(200, result))
        .catch(err => {
            console.error(err)
            res.send(500, err)
        })
})

app.del(`/:host/:path`, (req, res) => {
    const { host, path, secure } = proxyParse(req)
    httpDel(host, path, secure)
        .then(result => res.send(200, result))
        .catch(err => {
            console.error(err)
            res.send(500, err)
        })
})
