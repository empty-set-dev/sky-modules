import cookies from 'sky/helpers/cookies'

export default interface AuthRequest {
    user_login: string
    user_access_token: string
}

export function getAuthRequest(): AuthRequest {
    return {
        user_login: cookies.get('user_login'),
        user_access_token: cookies.get('user_access_token'),
    }
}
