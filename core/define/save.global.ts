import save, * as imports from './save'

declare global {
    type save = typeof imports.default
    const save: typeof imports.default
}

Object.assign(global, { save, ...imports })
