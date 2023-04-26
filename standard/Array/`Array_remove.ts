export default function Array_remove(this: Array<unknown>, v: unknown): void {
    const i = this.indexOf(v)

    if (i === -1) {
        return
    }

    this.splice(i, 1)
}
