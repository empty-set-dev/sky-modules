export default {
    title: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    examples: {
        '_examples/@pkgs/@artsy/fresnel': {
            target: 'web',
            public: '_examples/public',
        },
        '_examples/@pkgs/clickhouse/client-node': {
            target: 'node',
        },
        '_examples/@pkgs/clickhouse/client-web': {
            target: 'web',
            public: '_examples/public',
        },
        '_examples/@pkgs/express': {
            target: 'node',
        },

        '_examples/cameras/SkyPerspectiveCamera': {
            target: 'universal',
            public: '_examples/public',
        },

        '_examples/features/ecs': {
            target: 'node',
        },

        '_examples/@platform/node': {
            target: 'node',
        },
        '_examples/@platform/web': {
            target: 'web',
            public: '_examples/public',
        },
        '_examples/@platform/universal': {
            target: 'universal',
            public: '_examples/public',
        },
    },
    apps: {},
    scripts: {},
}
