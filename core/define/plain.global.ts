import plain, * as imports from './plain'

declare global {
    type plain = typeof imports.default
    const plain: typeof imports.default
    type Plain<T> = imports.Plain<T>
}

Object.assign(global, { plain, ...imports })
