export {}

declare global {
    namespace Sky {
        interface AppBase {
            id: string
            target: 'node' | 'universal' | 'web'
            jsx?: 'sky' | 'react' | 'svelte' | 'solid' | 'vue' | 'qwik' | 'angular'
            mitosis?: string[]
        }

        // New: Local app config
        interface AppConfig {
            id: string
            target: 'node' | 'universal' | 'web'
            jsx?: 'sky' | 'react' | 'svelte' | 'solid' | 'vue' | 'qwik' | 'angular'
            public?: string  // Required for web/universal
            mitosis?: string[]
        }

        interface App extends AppConfig {
            path: string
        }

        type AppDescription = Node.AppDescription | Web.AppDescription | Universal.AppDescription
        type AppParameters = Node.AppParameters | Web.AppParameters | Universal.AppParameters
        namespace Node {
            interface AppBase extends Sky.AppBase {
                target: 'node'
            }
            interface AppDescription extends AppBase {}
            interface AppParameters extends AppBase {
                path: string
            }
            type App = InstanceType<typeof lib.Node.App>
            const App: typeof lib.Node.App
        }
        namespace Web {
            interface AppBase extends Sky.AppBase {
                target: 'web'
                jsx: 'sky' | 'react' | 'svelte' | 'solid' | 'vue' | 'qwik' | 'angular'
                public: string
            }
            interface AppDescription extends AppBase {}
            interface AppParameters extends AppBase {
                path: string
            }
            type App = InstanceType<typeof lib.Web.App>
            const App: typeof lib.Web.App
        }
        namespace Universal {
            interface AppBase extends Sky.AppBase {
                target: 'universal'
                public: string
            }
            interface AppDescription extends AppBase {}
            interface AppParameters extends AppBase {
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
        jsx?: 'sky' | 'react' | 'svelte' | 'solid' | 'vue' | 'qwik' | 'angular'
        path: string
        mitosis?: string[]

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
