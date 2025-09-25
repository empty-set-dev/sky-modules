import FetchRequestInit, { __fetchArgs } from './__local'

declare global {
    namespace fetch {
        function call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response>
    }
}

Object.assign(fetch, {
    async call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response> {
        return await fetch(...__fetchArgs(url, init))
    },
})
