export default {
    title: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    apps: {
        '-examples/@pkgs/clickhouse': {
            path: '-examples/@pkgs/clickhouse',
            target: 'node',
        },

        '-examples/cameras/SkyPerspectiveCamera': {
            path: '-examples/cameras/SkyPerspectiveCamera',
            target: 'universal',
            public: '-examples/public',
        },

        '-examples/features/ecs': {
            path: '-examples/features/ecs',
            target: 'node',
        },

        '-examples/platform/node': {
            path: '-examples/platform/node',
            target: 'node',
        },
        '-examples/platform/web': {
            path: '-examples/platform/web',
            target: 'web',
            public: '-examples/public',
        },
        '-examples/platform/universal': {
            path: '-examples/platform/universal',
            target: 'universal',
            public: '-examples/public',
        },
    },
    scripts: {},
}
