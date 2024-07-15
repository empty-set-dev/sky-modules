export default interface __RequestInit extends Omit<RequestInit, 'body'> {
    body: unknown
}

export default function __toRequestInit(requestInit: __RequestInit): RequestInit {
    if (requestInit.body) {
        requestInit.body = JSON.stringify(requestInit.body)
    }

    return requestInit as RequestInit
}