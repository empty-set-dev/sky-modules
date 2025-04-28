import cookies from 'sky/platform/web/helpers/cookies'

export default function logout(store: { user?: object }): void {
    cookies.remove('user_login')
    cookies.remove('user_access_token')
    delete store.user
}
