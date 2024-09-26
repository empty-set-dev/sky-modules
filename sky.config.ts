export default {
    title: 'Sky',
    apps: {
        'examples/platform/web': {
            path: 'examples/platform/web',
            target: 'web',
            public: 'examples/platform/web/public',
        },
        'examples/platform/native': {
            path: 'examples/platform/native',
            target: 'native',
        },
        'examples/platform/node': {
            path: 'examples/platform/node',
            target: 'node',
        },
        'examples/platform/universal': {
            path: 'examples/platform/universal',
            target: 'universal',
            public: 'examples/platform/universal/public',
        },

        'examples/cameras/SkyPerspectiveCamera': {
            path: 'examples/cameras/SkyPerspectiveCamera',
            target: 'universal',
            public: 'examples/public',
        },
    },
    modules: {},
    scripts: {},
}
