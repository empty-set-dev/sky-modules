iAm('$NAMESPACE', import('.'))

declare global {
    interface Modules {
        $NAMESPACE: typeof import('.')
    }
}

export default 42
