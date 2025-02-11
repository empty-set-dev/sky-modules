import express from 'express'
import proxy from 'express-http-proxy'
import { logConsole } from 'sky/helpers/console'

const app = express()

app.use('/proxy', proxy('www.google.com'))

app.listen(3000)
logConsole('server listen http://localhost:3000')
