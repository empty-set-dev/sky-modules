declare global {
    namespace Vike {
        interface Config {
            'async-data'?: ((
                pageContext: Vike.PageContext,
                signal: AbortSignal
            ) => Promise<object>)[]
        }
    }
}

export default 'import:@sky-modules/react/vike/config:default'
