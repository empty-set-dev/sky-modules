// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function fetchJson<T extends any>(
    url: RequestInfo | URL,
    init?: RequestInit
): Promise<T> {
    return fetch(url, init).then(result => result.json())
}
