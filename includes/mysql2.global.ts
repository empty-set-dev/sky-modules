/// <reference types="./mysql2.global" />
import module from 'mysql2/promise'
import globalify from 'utilities/globalify/-globalify'

globalify({
    Mysql: { ...module },
})
