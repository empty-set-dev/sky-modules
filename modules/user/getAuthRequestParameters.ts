import cookies from 'sky/platform/web/helpers/cookies'

import RequestWithAuthParameters from './RequestWithAuthParameters'

export default function getRequestAuthParameters(): RequestWithAuthParameters {
    return {
        user_login: cookies.get('user_login'),
        user_access_token: cookies.get('user_access_token'),
    }
}
