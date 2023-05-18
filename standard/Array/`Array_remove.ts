export default function Array_remove(array: Array<unknown>, v: unknown): boolean {
    const i = array.indexOf(v)

    if (i === -1) {
        return false
    }

    array.splice(i, 1)

    return true
}
