export default function isIos(): boolean {
    return navigator.userAgent.includes('Mac') && 'ontouchend' in document
}
