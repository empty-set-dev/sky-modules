export {}

declare global {
    namespace Sky {
        interface ModuleBase {
            id: string
            mitosis?: string[]
            package?: string
        }
        interface ModuleDescription extends ModuleBase {}
        interface ModuleParameters extends ModuleBase {
            path: string
        }

        // New: Local module config (replaces slice.json)
        interface ModuleConfig {
            id: string
            package?: string

            // Code generation
            generateGlobals?: boolean // Generate global versions of files (default: false)

            // Publishing config (from slice.json)
            publishable?: boolean
            npm?: {
                description?: string
                keywords?: string[]
                access?: 'public' | 'restricted'

                // Module structure
                modules?: string[]
                separateModules?: string[]

                // Dependencies (used when publishing to NPM)
                // Note: versions are taken from root package.json
                // Just list package names here, or use object if you need specific version
                dependencies?: string[] | Record<string, string>
                peerDependencies?: string[] | Record<string, string>
                optionalDependencies?: string[] | Record<string, string>
            }
        }

        // Slice config (deprecated, will be replaced by ModuleConfig.npm)
        interface SliceConfig {
            name: string
            description?: string
            access?: 'public' | 'restricted'
            keywords?: string[]
            modules?: string[]
            dependencies?: Record<string, string>
            peerDependencies?: Record<string, string>
        }

        interface Module extends ModuleConfig {
            path: string
        }

        type ModuleInstance = lib.Module
        const ModuleClass: typeof lib.Module
    }
}

namespace lib {
    export class Module {
        id: string
        path: string
        package?: string
        generateGlobals?: boolean
        publishable?: boolean
        npm?: Sky.ModuleConfig['npm']

        constructor(config: Sky.ModuleConfig & { path: string }) {
            this.id = config.id
            this.path = config.path
            config.package && (this.package = config.package)
            config.generateGlobals && (this.generateGlobals = config.generateGlobals)
            config.publishable && (this.publishable = config.publishable)
            config.npm && (this.npm = config.npm)
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, { ModuleClass: lib.Module })
