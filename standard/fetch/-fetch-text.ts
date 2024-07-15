import FetchRequestInit, { __toRequestInit } from './__RequestInit'

declare global {
    namespace fetch {
        function text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string>
    }
}

Object.assign(fetch, {
    text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string> {
        return fetch(url, __toRequestInit(init)).then(result => result.text())
    },
})
