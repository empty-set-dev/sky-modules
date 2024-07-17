/// <reference types="./-mysql" />
import module from 'mysql2/promise'
import globalify from 'sky/helpers/globalify'

globalify({
    Mysql: { ...module },
})
