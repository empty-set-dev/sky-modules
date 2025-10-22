import reaction, * as imports from './reaction'

declare global {
    type reaction = typeof imports.default
    const reaction: typeof imports.default
}

Object.assign(global, { reaction, ...imports })
