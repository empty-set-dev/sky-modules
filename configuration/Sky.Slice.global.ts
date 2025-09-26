export {}

declare global {
    namespace Sky {
        interface BaseOfSlice {
            modules: string[]
        }
        interface SliceDescription extends BaseOfSlice {}
        interface SliceParameters extends BaseOfSlice {}

        interface SliceNpmConfig {
            name: string
            version: string
            description?: string
            access?: 'public' | 'restricted'
            keywords?: string[]
            dependencies?: Record<string, string>
            peerDependencies?: Record<string, string>
        }

        interface SliceDeployConfig {
            paths: string[]
            exclude?: string[]
            npm: SliceNpmConfig
            include?: string[]
            build?: {
                esm?: boolean
                cjs?: boolean
                declarations?: boolean
            }
        }

        type Slice = string[] | SliceDeployConfig
    }
}
