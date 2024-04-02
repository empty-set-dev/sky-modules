/// <reference types="./postgres.global" />
import module from 'postgres'
import globalify from 'utilities/globalify/globalify'

const Postgres = (...args: unknown[]): unknown => {
    return module(...args)
}

Object.assign(Postgres, module)

globalify({ Postgres })
