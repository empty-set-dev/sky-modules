#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')
const url = require('url')

const express = require('express')
const proxy = require('express-http-proxy')

const apiProxy = proxy('other_domain.com:3000/BLABLA', {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path,
})

const name = process.argv[2]

const app = express()

app.use(express.static(path.join(process.cwd(), `dist/${name}`)))
app.get('/api/*', apiProxy)
app.get('*', function (req, res) {
    res.sendFile(path.join(process.cwd(), `dist/${name}`, 'index.html'))
})

app.listen(80)
