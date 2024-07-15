export default interface FetchRequestInit extends Omit<RequestInit, 'body'> {
    body: unknown
}

export function __toRequestInit(requestInit: FetchRequestInit): RequestInit {
    if (requestInit.body) {
        requestInit.body = JSON.stringify(requestInit.body)
    }

    return requestInit as RequestInit
}
