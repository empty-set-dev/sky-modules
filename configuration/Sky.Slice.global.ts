export {}

declare global {
    namespace Sky {
        interface Slice {
            name: string
            description?: string
            access?: 'public' | 'restricted'
            keywords?: string[]
            modules?: string[]
            dependencies?: Record<string, string>
            peerDependencies?: Record<string, string>
        }
    }
}
