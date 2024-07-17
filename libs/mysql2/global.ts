/// <reference types="./-mysql" />
import globalify from 'helpers/globalify'
import module from 'mysql2/promise'

globalify({
    Mysql: { ...module },
})
