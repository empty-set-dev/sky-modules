import __RequestInit from "./__RequestInit"

export {}

declare global {
    namespace fetch {
        function json<T extends unknown>(url: RequestInfo | URL, init?: RequestInit): Promise<T>
    }
}

Object.assign(fetch, {
    json<T extends unknown>(url: RequestInfo | URL, init?: __RequestInit): Promise<T> {
        return fetch(url, init).then(result => result.json())
    },
})
