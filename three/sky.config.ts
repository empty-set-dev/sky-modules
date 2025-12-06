import '@sky-modules/cli/configuration'

export default {
    id: 'sky.three',
    package: '@sky-modules/three',
    publishable: true,
    npm: {
        description: 'Three.js 3D rendering module with WebGL support',
        keywords: ['threejs', '3d', 'webgl', 'rendering', 'graphics'],
        access: 'public',
        modules: ['.'],
        dependencies: ['@sky-modules/core'],
        peerDependencies: {
            three: '>=0.180.0',
        },
    },
} satisfies Sky.ModuleConfig
