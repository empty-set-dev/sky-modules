import jwt from 'jsonwebtoken'
import getEnvVariable from '@sky-modules/utilities/getEnvVariable'

const JWT_SECRET = getEnvVariable('JWT_SECRET')

export default function checkAuth(token: string, login: string): boolean {
    if (token === '') {
        return false
    }

    try {
        if (jwt.verify(token, JWT_SECRET) !== login) {
            return false
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return false
    }

    return true
}
