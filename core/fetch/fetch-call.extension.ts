import FetchRequestInit, { fetchArgs } from './Internal'

declare global {
    namespace fetch {
        function call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response>
    }
}

Object.assign(fetch, {
    async call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response> {
        return await fetch(...fetchArgs(url, init))
    },
})
