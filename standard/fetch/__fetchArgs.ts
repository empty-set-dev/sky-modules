export default interface FetchRequestInit extends Omit<RequestInit, 'body'> {
    params?: Record<string, unknown>
}

export function __fetchArgs(
    url: RequestInfo | URL,
    requestInit: FetchRequestInit
): [string, RequestInit] {
    const resultRequestInit = { ...requestInit } as RequestInit
    delete (resultRequestInit as { params }).params

    let resultUrl = url.toString()

    if (requestInit.params) {
        if (!requestInit.method || requestInit.method === 'GET') {
            const searchParams = new URLSearchParams()
            Object.keys(requestInit.params).forEach(k => {
                if (requestInit.params[k] != null) {
                    searchParams.set(k, requestInit.params[k].toString())
                }
            })
            resultUrl += '?' + searchParams.toString()
        } else {
            resultRequestInit.body = JSON.stringify(requestInit.params)
        }
    }

    return [resultUrl, resultRequestInit as RequestInit]
}
