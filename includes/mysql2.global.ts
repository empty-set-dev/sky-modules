/// <reference types="./mysql2.global" />
import * as module from 'mysql2/promise'
import globalify from 'utilities/globalify'

globalify({
    Mysql: { ...module },
})
