export {}

declare global {
    namespace Sky {
        interface BaseOfApp {
            id: string
            target: 'web' | 'node' | 'universal'
            public?: string
        }
        interface AppDescription extends Sky.BaseOfApp {}
        interface AppParameters extends Sky.BaseOfApp {
            path: string
        }
        namespace Web {
            interface App extends Sky.App {
                target: 'web'
                public: string
            }
        }
        namespace Universal {
            interface App extends Sky.App {
                target: 'universal'
                public: string
            }
        }
        type App = lib.App
        const App: typeof lib.App
    }
}

namespace lib {
    export class App {
        id: string
        target: 'web' | 'node' | 'universal'
        path: string
        public?: string

        constructor(parameters: Sky.AppParameters) {
            this.id = parameters.id
            this.target = parameters.target
            this.path = parameters.path

            if (parameters.public != null) {
                this.public = parameters.public
            }
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, lib)
