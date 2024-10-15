import FetchRequestInit, { __fetchArgs } from './__fetchArgs'

declare global {
    namespace fetch {
        function call<T extends unknown>(
            url: RequestInfo | URL,
            init?: FetchRequestInit
        ): Promise<T>
    }
}

Object.assign(fetch, {
    async call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<void> {
        await fetch(...__fetchArgs(url, init))
    },
})
