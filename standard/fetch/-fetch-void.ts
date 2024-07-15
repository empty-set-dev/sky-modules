import __RequestInit from './__RequestInit'

export {}

declare global {
    namespace fetch {
        function call<T extends unknown>(url: RequestInfo | URL, init?: RequestInit): Promise<T>
    }
}

Object.assign(fetch, {
    async call(url: RequestInfo | URL, init?: __RequestInit): Promise<void> {
        fetch(url, {
            ...init,
            body: init.body ? JSON.stringify(init.body) : null,
        })
    },
})
