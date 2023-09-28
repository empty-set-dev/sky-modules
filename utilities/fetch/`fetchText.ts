export default function fetchText(url: RequestInfo | URL, init?: RequestInit): Promise<string> {
    return fetch(url, init).then(result => result.text())
}
