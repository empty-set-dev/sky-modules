iAm('$MODULE', import('.'))

declare global {
    interface Modules {
        $MODULE: typeof import('.')
    }
}

export { default } from './_$MODULE'
export * from './_$MODULE'
