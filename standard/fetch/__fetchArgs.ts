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

    if (!requestInit.method || requestInit.method === 'GET') {
        const url = new URL(resultUrl)
        Object.keys(requestInit.params).forEach(k => {
            url.searchParams.set(k, requestInit.params[k].toString())
        })
        resultUrl = url.toString()
    } else {
        if (requestInit.params) {
            resultRequestInit.body = JSON.stringify(requestInit.params)
        }
    }

    return [resultUrl, resultRequestInit as RequestInit]
}
