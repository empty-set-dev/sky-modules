import cookies from 'sky/helpers/cookies'

export default function logout(): void {
    cookies.remove('user_login')
    cookies.remove('user_access_token')
}
