import 'sky/configuration/Sky.App.global'
import 'sky/configuration/Sky.Config.global'

const pkgsExamples: Record<string, Sky.AppDescription> = {
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

const platformExamples: Record<string, Sky.AppDescription> = {
    'examples/node': {
        id: 'sky.examples.node',
        target: 'node',
    },
    'examples/react': {
        id: 'sky.examples.react',
        target: 'web',
        public: 'examples/public',
    },
    'examples/qwik': {
        id: 'sky.examples.qwik',
        target: 'web',
        public: 'examples/public',
    },
    'examples/svelte': {
        id: 'sky.examples.svelte',
        target: 'web',
        public: 'examples/public',
    },
    'examples/solid': {
        id: 'sky.examples.solid',
        target: 'web',
        public: 'examples/public',
    },
    'examples/universal': {
        id: 'sky.examples.universal',
        target: 'universal',
        public: 'examples/public',
    },
}

const featuresExamples: Record<string, Sky.AppDescription> = {
    'examples/features/ecs': {
        id: 'sky.examples.features.ecs',
        target: 'node',
    },

    'examples/features/effect': {
        id: 'sky.examples.features.effect',
        target: 'node',
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
        'examples/projects/game': {
            id: 'sky.examples.projects.game',
            target: 'universal',
            public: 'examples/public',
        },
    },
    apps: {},
    slices: {
        'core.globalify': ['core/globalify'],
        core: ['core'],
        features: ['features'],
    },
    scripts: {
        claude: 'claude --dangerously-skip-permissions',
        'cloudflare dev': 'wrangler dev --remote',
    },
    folders: {
        '.': 'Sky',
        commands: 'Sky CLI',
        pkgs: 'Packages',
        platform: 'Sky ~ Platform',
        core: 'Sky ~ Core',
        crypto: 'Sky ~ Crypto',
        database: 'Sky ~ Database',
        serverless: 'Sky ~ Serverless',
        utilities: 'Sky ~ Utilities',
        helpers: 'Sky ~ Helpers',
        modules: 'Sky ~ Modules',
        features: 'Sky ~ Features',
        effects: 'Sky ~ Effects',
        ecs: 'Sky ~ ECS',
        math: 'Sky ~ Math',
        design: 'Sky ~ Design',
        Canvas: 'Sky · Canvas',
        Three: 'Sky · Three',
        qwik: 'Sky · Qwik',
        solid: 'Sky · Solid',
        svelte: 'Sky · Svelte',
        vue: 'Sky · Vue',
        react: 'Sky · React',
        examples: 'Sky Examples',
        'examples/Canvas': 'Sky Examples -  Canvas',
        'examples/Three': 'Sky Examples -  Three',
        'examples/node': 'Sky Examples  -  Node',
        'examples/universal': 'Sky Examples  -  Universal Example',
        'examples/qwik': 'Sky Example  -  Qwik',
        'examples/solid': 'Sky Example  -  Solid',
        'examples/svelte': 'Sky Example  -  Svelte',
        'examples/vue': 'Sky Example  -  Vue',
        'examples/react': 'Sky Example  -  React',
        'examples/projects/game': 'Sky  -  Showcase Game',
    },
} as Sky.ConfigDescription
