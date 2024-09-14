/// <reference types="./-mysql" />
import lib from 'mysql2/promise'
import globalify from 'sky/helpers/globalify'

globalify({
    Mysql: { ...lib },
})
