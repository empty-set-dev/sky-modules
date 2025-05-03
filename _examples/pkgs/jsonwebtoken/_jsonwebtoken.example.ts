import jwt from 'pkgs/jsonwebtoken'
import { logConsole } from 'sky/utilities/console'

const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
logConsole(token)

const decoded = jwt.verify(token, 'shhhhh')
logConsole(decoded)
