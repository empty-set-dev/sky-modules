import globalify from 'sky/helpers/globalify'

declare global {}

function withContext<T extends { constructor: Function }>(
    target: Root,
    context: T,
    deps: EffectDeps
): Effect {
    return new Effect(() => {
        target.addContext(context)

        return () => {
            target.removeContext(context)
        }
    }, deps)
}

globalify({ withContext })
