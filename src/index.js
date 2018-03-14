'use strict'

const fs = require('fs')
const path = require('path')
const app = require('./app')

require('./routes')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, console.info(
    `App listening at http://${host}:${port}`))
