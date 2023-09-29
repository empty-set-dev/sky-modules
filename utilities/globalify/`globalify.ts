import Object from 'types/Object'

declare const global: object

export default function globalify(module: object): void {
    Object.assign(global, module)
}
