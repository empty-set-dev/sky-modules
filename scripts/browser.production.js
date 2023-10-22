#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const name = process.argv[2]

const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, `dist/${name}`)))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, `dist/${name}`, 'index.html'))
})

app.listen(80)
