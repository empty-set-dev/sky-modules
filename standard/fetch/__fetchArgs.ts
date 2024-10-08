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

    const { params } = requestInit
    if (params) {
        if (!requestInit.method || requestInit.method === 'GET') {
            const searchParams = new URLSearchParams()
            Object.keys(params).forEach(k => {
                if (params[k] != null) {
                    searchParams.set(k, params[k].toString())
                }
            })
            if (searchParams.size > 0) {
                resultUrl += '?' + searchParams.toString()
            }
        } else {
            resultRequestInit.body = JSON.stringify(requestInit.params)
        }
    }

    return [resultUrl, resultRequestInit as RequestInit]
}
