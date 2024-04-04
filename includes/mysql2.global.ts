/// <reference types="./mysql2.global" />
import globalify from 'helpers/globalify'
import module from 'mysql2/promise'

globalify({
    Mysql: { ...module },
})
