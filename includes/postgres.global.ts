/// <reference types="./postgres.global" />
import * as module from 'postgres'
import globalify from 'utilities/globalify'

globalify({
    Postgres: module.default,
})
