import 'base/globalify'
import local_mysql from './defaultly'

globalify({ mysql: local_mysql })

declare global {
    const mysql: typeof local_mysql
}
