/// <reference types="./-postgres" />
import lib from 'postgres'
import globalify from 'sky/helpers/globalify'

const Postgres = (...args: unknown[]): unknown => {
    return lib(...args)
}

Object.assign(Postgres, lib)

globalify({ Postgres })
