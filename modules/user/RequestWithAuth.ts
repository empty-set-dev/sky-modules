import cookies from 'sky/platform/web/helpers/cookies'

export default interface RequestWithAuth {
    user_login: string
    user_access_token: string
}

export function getAuthRequest(): RequestWithAuth {
    return {
        user_login: cookies.get('user_login'),
        user_access_token: cookies.get('user_access_token'),
    }
}
