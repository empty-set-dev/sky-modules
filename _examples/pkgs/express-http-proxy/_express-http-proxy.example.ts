import express from 'express'
import proxy from 'express-http-proxy'
import { Console.log } from 'sky/utilities/Console2e

const app = express()

app.use('/proxy', proxy('www.google.com'))

app.listen(3000)
Console.log('server listen http://localhost:3000')
