export default function canClone(object: unknown): boolean {
    try {
        structuredClone(object)
        return true
    } catch (err: unknown) {
        err
        return false
    }
}
