export default {
    title: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    apps: {
        '_examples/@pkgs/clickhouse/client': {
            path: '_examples/@pkgs/clickhouse/client',
            target: 'node',
        },
        '_examples/@pkgs/clickhouse/client-web': {
            path: '_examples/@pkgs/clickhouse/client-web',
            target: 'web',
            public: '_examples/public',
        },
        '_examples/@pkgs/express': {
            path: '_examples/@pkgs/express',
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

        '_examples/@platform/node': {
            path: '_examples/@platform/node',
            target: 'node',
        },
        '_examples/@platform/web': {
            path: '_examples/@platform/web',
            target: 'web',
            public: '_examples/public',
        },
        '_examples/@platform/universal': {
            path: '_examples/@platform/universal',
            target: 'universal',
            public: '_examples/public',
        },
    },
    scripts: {},
}
