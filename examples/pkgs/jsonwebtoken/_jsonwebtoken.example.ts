import jwt from 'pkgs/jsonwebtoken'
import Console from 'sky/core/Console'

const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
Console.log(token)

const decoded = jwt.verify(token, 'shhhhh')
Console.log(decoded)
