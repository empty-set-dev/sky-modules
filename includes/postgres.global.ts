/// <reference types="./postgres.global" />
import globalify from 'helpers/globalify'
import module from 'postgres'

const Postgres = (...args: unknown[]): unknown => {
    return module(...args)
}

Object.assign(Postgres, module)

globalify({ Postgres })
