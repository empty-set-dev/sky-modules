import Object from 'types/Object'

export default globalify

declare const global: object

function globalify(module: object): void {
    Object.assign(global, module)
}
