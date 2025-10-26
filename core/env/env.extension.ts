declare global {
    interface Env {}
}

const env = typeof process !== 'undefined' ? process.env : typeof import.meta.env

export default env as Env
