import '@sky-modules/cli/configuration'

export default {
    id: 'sky.behavior',
    package: '@sky-modules/behavior',
    publishable: true,
    npm: {
        description:
            'Behavior system - reactive programming with signals, animations, and frame loops',
        keywords: [
            'reactive',
            'signals',
            'animations',
            'spring',
            'tween',
            'frame-loop',
            'behavior',
        ],
        access: 'public',
        modules: ['FrameLoop'],
        dependencies: ['@sky-modules/core'],
        peerDependencies: {
            robot3: '>=1.0.0',
        },
    },
} satisfies Sky.ModuleConfig
