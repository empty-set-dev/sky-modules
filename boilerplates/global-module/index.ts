iAm('$GLOBAL_MODULE', import('.'))

declare global {
    interface Modules {
        $GLOBAL_MODULE: typeof import('.')
    }
}

export { default } from './_{{GLOBAL_MODULE}}'
export * from './_{{GLOBAL_MODULE}}'
