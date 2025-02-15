const camerasExamples = {
    '_examples/cameras/SkyPerspectiveCamera': {
        target: 'universal',
        public: '_examples/public',
    },
}

const pkgsExamples = {
    '_examples/pkgs/@artsy/fresnel': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/@clickhouse/client': {
        target: 'node',
    },
    '_examples/pkgs/@clickhouse/client-web': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/@tanstack/react-query': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/argon2': {
        target: 'node',
    },
    '_examples/pkgs/args': {
        target: 'node',
    },
    '_examples/pkgs/express': {
        target: 'node',
    },
    '_examples/pkgs/express-http-proxy': {
        target: 'node',
    },
    '_examples/pkgs/jsonwebtoken': {
        target: 'node',
    },
    '_examples/pkgs/knex': {
        target: 'node',
    },
    '_examples/pkgs/lottie-colorify': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/lottie-web': {
        target: 'web',
        public: '_examples/public',
    },
}

const platformExamples = {
    '_examples/platform/node': {
        target: 'node',
    },
    '_examples/platform/web': {
        target: 'web',
        public: '_examples/public',
    },
    '_examples/platform/universal': {
        target: 'universal',
        public: '_examples/public',
    },
}

const featuresExamples = {
    '_examples/features/ecs': {
        target: 'node',
    },

    '_examples/features/effect': {
        target: 'node',
    },
}

const ui = {
    '_examples/ui': {
        target: 'universal',
        public: '_examples/public',
    },
}

export default {
    name: 'Sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    examples: {
        ...camerasExamples,
        ...featuresExamples,
        ...pkgsExamples,
        ...platformExamples,
        ...ui,
    },
    apps: {},
    scripts: {},
}
