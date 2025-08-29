import { SkyAppDescription } from 'sky/configuration/SkyApp'
import { SkyConfigDescription } from 'sky/configuration/SkyConfig'

const pkgsExamples: Record<string, SkyAppDescription> = {
    'examples/pkgs/@artsy/fresnel': {
        id: 'sky.examples.pkgs.@artsy.fresnel',
        target: 'web',
        public: 'examples/public',
    },
    'examples/pkgs/@clickhouse/client': {
        id: 'sky.examples.pkgs.@clickhouse.client',
        target: 'node',
    },
    'examples/pkgs/@clickhouse/client-web': {
        id: 'sky.examples.pkgs.@clickhouse.client-web',
        target: 'web',
        public: 'examples/public',
    },
    'examples/pkgs/argon2': {
        id: 'sky.examples.pkgs.argon2',
        target: 'node',
    },
    'examples/pkgs/args': {
        id: 'sky.examples.pkgs.args',
        target: 'node',
    },
    'examples/pkgs/express': {
        id: 'sky.examples.pkgs.express',
        target: 'node',
    },
    'examples/pkgs/express-http-proxy': {
        id: 'sky.examples.pkgs.express-http-proxy',
        target: 'node',
    },
    'examples/pkgs/jsonwebtoken': {
        id: 'sky.examples.pkgs.jsonwebtoken',
        target: 'node',
    },
    'examples/pkgs/knex': {
        id: 'sky.examples.pkgs.knex',
        target: 'node',
    },
    'examples/pkgs/lottie-colorify': {
        id: 'sky.examples.pkgs.lottie-colorify',
        target: 'web',
        public: 'examples/public',
    },
    'examples/pkgs/lottie-web': {
        id: 'sky.examples.pkgs.lottie-web',
        target: 'web',
        public: 'examples/public',
    },
}

const platformExamples: Record<string, SkyAppDescription> = {
    'examples/platform/node': {
        id: 'sky.examples.platform.node',
        target: 'node',
    },
    'examples/platform/web': {
        id: 'sky.examples.platform.web',
        target: 'web',
        public: 'examples/public',
    },
    'examples/platform/universal': {
        id: 'sky.examples.platform.universal',
        target: 'universal',
        public: 'examples/public',
    },
}

const featuresExamples: Record<string, SkyAppDescription> = {
    'examples/features/ecs': {
        id: 'sky.examples.features.ecs',
        target: 'node',
    },

    'examples/features/effect': {
        id: 'sky.examples.features.effect',
        target: 'node',
    },
}

const ui: Record<string, SkyAppDescription> = {
    'examples/UI': {
        id: 'sky.examples.UI',
        target: 'universal',
        public: 'examples/public',
    },
    'examples/components/UI': {
        id: 'sky.examples.components.UI',
        target: 'web',
        public: 'examples/public',
    },
}

export default {
    name: 'Sky Modules',
    id: 'sky',
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
        'examples/projects/game': {
            id: 'sky.examples.projects.game',
            target: 'universal',
            public: 'examples/public',
        },
    },
    apps: {},
    scripts: {},
    folders: {
        '.': 'Sky',
        commands: 'Sky Commands',
        pkgs: 'Packages',
        platform: 'Sky Platform',
        standard: 'Sky Standard',
        utilities: 'Sky Utilities',
        helpers: 'Sky Helpers',
        modules: 'Sky Modules',
        features: 'Sky Features',
        examples: 'Sky | Examples',
        'examples/projects/game': 'Sky | Showcase Game',
    },
} as SkyConfigDescription
