import FetchRequestInit, { __toRequestInit } from './__RequestInit'

export {}

declare global {
    namespace fetch {
        function json<T extends unknown>(
            url: RequestInfo | URL,
            init?: FetchRequestInit
        ): Promise<T>
    }
}

Object.assign(fetch, {
    json<T extends unknown>(url: RequestInfo | URL, init?: FetchRequestInit): Promise<T> {
        return fetch(url, __toRequestInit(init)).then(result => result.json())
    },
})
