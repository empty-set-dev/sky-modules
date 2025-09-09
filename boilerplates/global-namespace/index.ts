iAm('$GLOBAL_NAMESPACE', import('.'))

declare global {
    interface Modules {
        $GLOBAL_NAMESPACE: typeof import('.')
    }
}

export default 42
