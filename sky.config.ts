export default {
    title: 'Sky',
    apps: {
        'examples/platform/web': {
            path: 'examples/platform/web',
            target: 'web',
            public: 'examples/public',
        },
        'examples/platform/node': {
            path: 'examples/platform/node',
            target: 'node',
        },
        'examples/platform/universal': {
            path: 'examples/platform/universal',
            target: 'universal',
            public: 'examples/public',
        },
        'examples/cameras/SkyPerspectiveCamera': {
            path: 'examples/cameras/SkyPerspectiveCamera',
            target: 'universal',
            public: 'examples/public',
        },
        'examples/features/ecs': {
            path: 'examples/features/ecs',
            target: 'node',
        },
    },
    modules: {},
    scripts: {},
}
