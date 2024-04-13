#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const express = require('express')
const proxy = require('express-http-proxy')

const apiProxy = proxy('127.0.0.1:3001', {
    proxyReqPathResolver: req => req.originalUrl,
})

const name = process.argv[2]

const app = express()

app.use('/api/*', apiProxy)
app.use(express.static(path.join(process.cwd(), `dist/${name}`)))
app.get('/*', function (req, res) {
    res.sendFile(path.join(process.cwd(), `dist/${name}`, 'index.html'))
})

app.listen(80)
