export {}

declare global {
    namespace Sky {
        interface BaseOfApp {
            id: string
            target: 'web' | 'node' | 'universal'
            jsx?: 'react' | 'svelte' | 'solid' | 'vue' | 'qwik'
        }
        type AppDescription = Node.AppDescription | Web.AppDescription | Universal.AppDescription
        type AppParameters = Node.AppParameters | Web.AppParameters | Universal.AppParameters
        namespace Node {
            interface BaseOfApp extends Sky.BaseOfApp {
                target: 'node'
            }
            interface AppDescription extends BaseOfApp {}
            interface AppParameters extends BaseOfApp {
                path: string
            }
            type App = InstanceType<typeof lib.Node.App>
            const App: typeof lib.Node.App
        }
        namespace Web {
            interface BaseOfApp extends Sky.BaseOfApp {
                target: 'web'
                jsx: 'react' | 'svelte' | 'solid' | 'vue' | 'qwik'
                public: string
            }
            interface AppDescription extends BaseOfApp {}
            interface AppParameters extends BaseOfApp {
                path: string
            }
            type App = InstanceType<typeof lib.Web.App>
            const App: typeof lib.Web.App
        }
        namespace Universal {
            interface BaseOfApp extends Sky.BaseOfApp {
                target: 'universal'
                public: string
            }
            interface AppDescription extends BaseOfApp {}
            interface AppParameters extends BaseOfApp {
                path: string
            }
            type App = InstanceType<typeof lib.Universal.App>
            const App: typeof lib.Universal.App
        }
        type App =
            | InstanceType<typeof Node.App>
            | InstanceType<typeof Web.App>
            | InstanceType<typeof Universal.App>
        const App: typeof lib.App
    }
}

namespace lib {
    export abstract class App {
        id: string
        jsx?: 'react' | 'svelte' | 'solid' | 'vue' | 'qwik'
        path: string

        constructor(parameters: Sky.AppParameters) {
            this.id = parameters.id
            this.path = parameters.path
            parameters.jsx != null && (this.jsx = parameters.jsx)
        }
    }

    export namespace Node {
        export class App extends lib.App {
            target: 'node'

            constructor(parameters: Sky.Node.AppParameters) {
                super(parameters)

                this.target = parameters.target
            }
        }
    }

    export namespace Web {
        export class App extends lib.App {
            target: 'web'
            public: string

            constructor(parameters: Sky.Web.AppParameters) {
                super(parameters)

                this.target = parameters.target
                this.public = parameters.public
            }
        }
    }

    export namespace Universal {
        export class App extends lib.App {
            target: 'universal'
            public: string

            constructor(parameters: Sky.Universal.AppParameters) {
                super(parameters)

                this.target = parameters.target
                this.public = parameters.public
            }
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, lib)
