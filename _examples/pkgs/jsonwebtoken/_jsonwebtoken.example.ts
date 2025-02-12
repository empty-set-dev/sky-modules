import { logConsole } from 'sky/helpers/console'
import jwt from 'sky/pkgs/jsonwebtoken'

const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
logConsole(token)

const decoded = jwt.verify(token, 'shhhhh')
logConsole(decoded)
