import { logConsole } from 'sky/utilities/console'
import jwt from 'sky/pkgs/jsonwebtoken'

const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
logConsole(token)

const decoded = jwt.verify(token, 'shhhhh')
logConsole(decoded)
