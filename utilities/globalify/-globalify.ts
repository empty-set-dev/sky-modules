export default function globalify(module: object): void {
    Object.assign(global, module)
}
