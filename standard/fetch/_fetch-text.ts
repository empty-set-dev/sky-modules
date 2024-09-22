import FetchRequestInit, { __fetchArgs } from './__fetchArgs'

declare global {
    namespace fetch {
        function text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string>
    }
}

Object.assign(fetch, {
    text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string> {
        return fetch(...__fetchArgs(url, init)).then(result => result.text())
    },
})
