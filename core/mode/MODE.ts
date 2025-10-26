declare global {
    interface ImportMeta {
        
    }
}

const MODE = typeof process !== 'undefined' ? process.env.NODE_ENV : import.meta.env.MODE

export default MODE

export const DEV = MODE === 'development'
export const TEST = MODE === 'test'
export const PROD = MODE === 'production'
