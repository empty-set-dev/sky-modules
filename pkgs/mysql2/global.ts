/// <reference types="./-mysql" />
import pkg from 'mysql2/promise'
import globalify from 'sky/helpers/globalify'

globalify({
    Mysql: { ...pkg },
})
