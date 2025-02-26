import jwt from 'jsonwebtoken'
import getEnvVariable from 'sky/helpers/getEnvVariable'
import { redirect } from 'vike/abort'

const JWT_SECRET = getEnvVariable('JWT_SECRET')

export default function checkAuth(token: string, login: string): void {
    if (token === '') {
        throw redirect('/login')
    }

    try {
        if (jwt.verify(token, JWT_SECRET) !== login) {
            throw redirect('/login')
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        throw redirect('/login')
    }
}
