export default function isIos(): boolean {
    const ua = navigator.userAgent
    const platform = navigator.platform

    return /iPhone|iPad|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function getIosVersion(): number | null {
    const match = navigator.userAgent.match(/OS (\d+)_/)
    return match ? parseInt(match[1], 10) : null
}
