import local from './default'
globalify(local)

declare global {
    const types: typeof local.types
}
