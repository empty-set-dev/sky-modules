import { SkyAppDescription } from '../configuration/SkyApp'
import { SkyConfigDescription } from '../configuration/SkyConfig'

const pkgsExamples: Record<string, SkyAppDescription> = {
    '_examples/pkgs/@artsy/fresnel': {
        id: 'sky.examples.pkgs.@artsy.fresnel',
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/@clickhouse/client': {
        id: 'sky.examples.pkgs.@clickhouse.client',
        target: 'node',
    },
    '_examples/pkgs/@clickhouse/client-web': {
        id: 'sky.examples.pkgs.@clickhouse.client-web',
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/argon2': {
        id: 'sky.examples.pkgs.argon2',
        target: 'node',
    },
    '_examples/pkgs/args': {
        id: 'sky.examples.pkgs.args',
        target: 'node',
    },
    '_examples/pkgs/express': {
        id: 'sky.examples.pkgs.express',
        target: 'node',
    },
    '_examples/pkgs/express-http-proxy': {
        id: 'sky.examples.pkgs.express-http-proxy',
        target: 'node',
    },
    '_examples/pkgs/jsonwebtoken': {
        id: 'sky.examples.pkgs.jsonwebtoken',
        target: 'node',
    },
    '_examples/pkgs/knex': {
        id: 'sky.examples.pkgs.knex',
        target: 'node',
    },
    '_examples/pkgs/lottie-colorify': {
        id: 'sky.examples.pkgs.lottie-colorify',
        target: 'web',
        public: '_examples/public',
    },
    '_examples/pkgs/lottie-web': {
        id: 'sky.examples.pkgs.lottie-web',
        target: 'web',
        public: '_examples/public',
    },
}

const platformExamples: Record<string, SkyAppDescription> = {
    '_examples/platform/node': {
        id: 'sky.examples.platform.node',
        target: 'node',
    },
    '_examples/platform/web': {
        id: 'sky.examples.platform.web',
        target: 'web',
        public: '_examples/public',
    },
    '_examples/platform/universal': {
        id: 'sky.examples.platform.universal',
        target: 'universal',
        public: '_examples/public',
    },
}

const featuresExamples: Record<string, SkyAppDescription> = {
    '_examples/features/ecs': {
        id: 'sky.examples.features.ecs',
        target: 'node',
    },

    '_examples/features/effect': {
        id: 'sky.examples.features.effect',
        target: 'node',
    },
}

const ui: Record<string, SkyAppDescription> = {
    '_examples/UI': {
        id: 'sky.examples.UI',
        target: 'universal',
        public: '_examples/public',
    },
    '_examples/components/UI': {
        id: 'sky.examples.components.UI',
        target: 'web',
        public: '_examples/public',
    },
}

export default {
    name: 'Sky Modules',
    package: 'sky',
    modules: {
        sky: {
            id: 'sky',
            path: '.',
        },
    },
    examples: {
        ...pkgsExamples,
        ...platformExamples,
        ...featuresExamples,
        ...ui,
        '_examples/projects/game': {
            id: 'sky.examples.projects.game',
            target: 'universal',
            public: '_examples/public',
        },
    },
    apps: {},
    scripts: {},
    folders: {
        '.': 'Sky',
        _commands: 'Sky Commands',
        platform: 'Sky Platform',
        standard: 'Sky Standard',
        utilities: 'Sky Utilities',
        helpers: 'Sky Helpers',
        modules: 'Sky Modules',
        features: 'Sky Features',
        pkgs: 'Sky Pkgs',
        _examples: 'Sky | Examples',
        '_examples/projects/game': 'Sky | Showcase Game',
    },
} as SkyConfigDescription
