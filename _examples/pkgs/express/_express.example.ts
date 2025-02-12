import { logConsole } from 'sky/helpers/console'
import express from 'sky/pkgs/express'

const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)
logConsole('server listen http://localhost:3000')
