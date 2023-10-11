export {}

declare global {
    namespace fetch {
        function text(url: RequestInfo | URL, init?: RequestInit): Promise<string>
    }
}

Object.assign(fetch, {
    text(url: RequestInfo | URL, init?: RequestInit): Promise<string> {
        return fetch(url, init).then(result => result.text())
    },
})
