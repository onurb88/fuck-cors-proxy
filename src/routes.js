'use strict'

const app = require('./app')
const {
    proxyParse,
    httpGet,
    httpPut,
    httpPost,
    httpDelete
} = require('./lib/utils')
const helpMessage = require('./lib/help-message.json')

app.get('/', (req, res) => {
    res.send(200, {
        name: app.name,
        help: helpMessage
    })
})

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
