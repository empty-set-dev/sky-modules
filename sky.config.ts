const pkgsExamples = {
    '_examples/@pkgs/@artsy/fresnel': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/@pkgs/clickhouse/client': {
        target: 'node',
    },
    '_examples/@pkgs/clickhouse/client-web': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/@pkgs/@tanstack/react-query': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/@pkgs/argon2': {
        target: 'node',
    },
    '_examples/@pkgs/args': {
        target: 'node',
    },
    '_examples/@pkgs/express': {
        target: 'node',
    },
    '_examples/@pkgs/express-http-proxy': {
        target: 'node',
    },
    '_examples/@pkgs/jsonwebtoken': {
        target: 'node',
    },
    '_examples/@pkgs/knex': {
        target: 'node',
    },
    '_examples/@pkgs/lottie-colorify': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/@pkgs/lottie-web': {
        target: 'web',
        public: '_examples/public',
    },
}

const platformExamples = {
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
}

export default {
    title: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    examples: {
        ...pkgsExamples,
        ...platformExamples,

        '_examples/cameras/SkyPerspectiveCamera': {
            target: 'universal',
            public: '_examples/public',
        },

        '_examples/features/ecs': {
            target: 'node',
        },
    },
    apps: {},
    scripts: {},
}
