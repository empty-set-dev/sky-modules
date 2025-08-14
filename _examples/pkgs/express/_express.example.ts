import express from 'pkgs/express'
import { Console.log } from 'sky/utilities/Console

const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)
Console.log('server listen http://localhost:3000')
