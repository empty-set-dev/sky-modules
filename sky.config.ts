import { SkyAppDescription } from './configuration/SkyApp'
import { SkyConfigDescription } from './configuration/SkyConfig'

const pkgsExamples: Record<string, SkyAppDescription> = {
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

const platformExamples: Record<string, SkyAppDescription> = {
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

const featuresExamples: Record<string, SkyAppDescription> = {
    '_examples/features/ecs': {
        target: 'node',
    },

    '_examples/features/effect': {
        target: 'node',
    },
}

const ui: Record<string, SkyAppDescription> = {
    '_examples/UI': {
        target: 'universal',
        public: '_examples/public',
    },
    '_examples/components/UI': {
        target: 'web',
        public: '_examples/public',
    },
}

export default {
    name: 'Sky Modules',
    package: 'sky',
    modules: {
        sky: {
            path: '.',
        },
    },
    examples: {
        ...pkgsExamples,
        ...platformExamples,
        ...featuresExamples,
        ...ui,
    },
    apps: {},
    scripts: {},
} as SkyConfigDescription
