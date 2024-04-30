import globalify from 'helpers/globalify'

declare global {
    interface Root {
        emit(event: 'Frame', dt: time): void
    }

    const emittingFrame: (link: Link, options?: { log?: boolean; auto?: boolean }) => () => Effect
    const onFrame: (root: Root, deps: EffectDeps, callback: (dt: time) => void) => Effect
}

globalify({
    emittingFrame(root: Root, deps: EffectDeps, options: { log?: boolean } = {}): Effect {
        const log = options.log ?? false

        const timer = new Timer('Frame')
        return new AnimationFrames(() => {
            log && timer.log()
            root.emit('Frame', timer.time())
        }, deps)
    },

    onFrame: (root: Root, callback: (dt: time) => void, deps: EffectDeps): Effect =>
        root.on('Frame', callback, deps),
})
