export default {
    title: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    apps: {
        '_examples/@pkgs/clickhouse': {
            path: '_examples/@pkgs/clickhouse',
            target: 'node',
        },

        '_examples/cameras/SkyPerspectiveCamera': {
            path: '_examples/cameras/SkyPerspectiveCamera',
            target: 'universal',
            public: '_examples/public',
        },

        '_examples/features/ecs': {
            path: '_examples/features/ecs',
            target: 'node',
        },

        '_examples/platform/node': {
            path: '_examples/platform/node',
            target: 'node',
        },
        '_examples/platform/web': {
            path: '_examples/platform/web',
            target: 'web',
            public: '_examples/public',
        },
        '_examples/platform/universal': {
            path: '_examples/platform/universal',
            target: 'universal',
            public: '_examples/public',
        },
    },
    scripts: {},
}
