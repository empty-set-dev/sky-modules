/// <reference types="./-postgres" />
import pkg from 'postgres'
import globalify from 'sky/helpers/globalify'

const Postgres = (...args: unknown[]): unknown => {
    return pkg(...args)
}

Object.assign(Postgres, pkg)

globalify({ Postgres })
