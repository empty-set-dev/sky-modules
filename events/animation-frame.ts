export {}

declare global {
    interface Root {
        emit(event: 'Frame', dt: time): void
    }

    const onFrame: (root: Root, callback: (dt: time) => void) => void
    const emittingFrame: (link: Link, options?: { log?: boolean; auto?: boolean }) => () => void
}

namespace module {
    export function emittingFrame(
        link: Link,
        options: { auto?: boolean; log?: boolean } = {}
    ): () => void {
        const auto = options.auto ?? true
        const log = options.log ?? false

        const timer = new Timer('Frame')
        auto &&
            new AnimationFrames(link, () => {
                log && timer.log()
                link.emit('Frame', timer.time())
            })

        if (!auto) {
            return (): void => {
                log && timer.log()
                link.emit('Frame', timer.time())
            }
        }
    }
}

Object.assign(global, module, {
    onFrame: (root: Root, callback: (dt: time) => void, deps: EffectDeps): void =>
        root.on('Frame', callback, deps),
})
