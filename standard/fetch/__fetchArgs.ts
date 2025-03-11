export default interface FetchRequestInit extends Omit<RequestInit, 'body'> {
    params?: Record<string, unknown>
}

export function __fetchArgs(
    url: RequestInfo | URL,
    requestInit: FetchRequestInit = {}
): [string, RequestInit] {
    const resultRequestInit = { ...requestInit } as RequestInit
    delete (resultRequestInit as { params: unknown }).params

    let resultUrl = url.toString()

    const { headers, params, credentials } = requestInit
    if (params) {
        if (!requestInit.method || requestInit.method === 'GET') {
            const searchParams = new URLSearchParams()
            let size = 0
            Object.keys(params).forEach(k => {
                if (params[k] != null) {
                    searchParams.set(k, params[k].toString())
                    ++size
                }
            })

            if (size > 0) {
                resultUrl += '?' + searchParams.toString()
            }
        } else {
            resultRequestInit.body = JSON.stringify(requestInit.params)
        }
    }

    if (headers) {
        resultRequestInit.headers = headers
    }

    if (credentials) {
        resultRequestInit.credentials = credentials
    }

    return [resultUrl, resultRequestInit as RequestInit]
}
