import cookies from 'sky/helpers/cookies'

export default function auth(login: string, token: string): void {
    cookies.set('user_login', login)
    cookies.set('user_access_token', token)
}
