/// <reference types="./-postgres" />
import module from 'postgres'
import globalify from 'sky/helpers/globalify'

const Postgres = (...args: unknown[]): unknown => {
    return module(...args)
}

Object.assign(Postgres, module)

globalify({ Postgres })
