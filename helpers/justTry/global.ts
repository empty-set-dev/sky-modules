import globalify from '../globalify'

declare global {
    function justTry<T>(fn: () => T): Promise<undefined | T>
}

globalify({ justTry })
