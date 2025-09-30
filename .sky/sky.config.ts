import '@sky-modules/cli/configuration/Sky.App.global'
import '@sky-modules/cli/configuration/Sky.Config.global'

const pkgsExamples: Record<string, Sky.AppDescription> = {
    'examples/pkgs/@artsy/fresnel': {
        id: 'sky.examples.pkgs.@artsy.fresnel',
        target: 'node',
    },
}

const platformExamples: Record<string, Sky.AppDescription> = {
    'examples/node': {
        id: 'sky.examples.node',
        target: 'node',
    },
    'examples/qwik': {
        id: 'sky.examples.qwik',
        target: 'web',
        jsx: 'qwik',
        public: 'examples/public',
        mitosis: ['@sky-modules/universal', '@sky-modules/design'],
    },
    'examples/svelte': {
        id: 'sky.examples.svelte',
        target: 'web',
        jsx: 'svelte',
        public: 'examples/public',
        mitosis: ['universal', 'design', 'vike'],
    },
    'examples/solid': {
        id: 'sky.examples.solid',
        target: 'web',
        jsx: 'solid',
        public: 'examples/public',
        mitosis: ['universal', 'design', 'vike'],
    },
    'examples/vue': {
        id: 'sky.examples.vue',
        target: 'web',
        jsx: 'vue',
        public: 'examples/public',
        mitosis: ['universal', 'design', 'vike'],
    },
    'examples/react': {
        id: 'sky.examples.react',
        target: 'web',
        jsx: 'react',
        public: 'examples/public',
        mitosis: ['universal', 'design', 'vike'],
    },
    'examples/universal': {
        id: 'sky.examples.universal',
        target: 'universal',
        public: 'examples/public',
        mitosis: ['universal', 'design'],
    },
}

const featuresExamples: Record<string, Sky.AppDescription> = {
    'examples/features/ecs': {
        id: 'sky.examples.features.ecs',
        target: 'universal',
        public: 'examples/public',
    },

    'examples/features/effect': {
        id: 'sky.examples.features.effect',
        target: 'universal',
        public: 'examples/public',
    },
}

export default {
    name: 'Sky Modules',
    id: 'sky',
    modules: {},
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
    scripts: {
        'cloudflare dev': 'wrangler dev --remote',
    },
    folders: {
        '.': 'Sky',
        cli: 'Sky CLI',
        pkgs: 'Packages',
        platform: 'Sky ~ Platform',
        universal: 'Sky ~ Universal',
        web: 'Sky ~ Web',
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
        vike: 'Sky · Vike',
        qwik: 'Sky · Qwik',
        solid: 'Sky · Solid',
        svelte: 'Sky · Svelte',
        vue: 'Sky · Vue',
        react: 'Sky · React',
        examples: 'Sky Examples',
        'examples/pkgs': 'Sky Examples  -  Packages',
        '../sky-modules-workspace-example': 'Sky Example  -  Workspace',
        'examples/Canvas': 'Sky Examples  -  Canvas',
        'examples/Three': 'Sky Examples  -  Three',
        'examples/node': 'Sky Example  -  Node',
        'examples/universal': 'Sky Example  -  Universal',
        'examples/qwik': 'Sky Example  -  Qwik',
        'examples/solid': 'Sky Example  -  Solid',
        'examples/svelte': 'Sky Example  -  Svelte',
        'examples/vue': 'Sky Example  -  Vue',
        'examples/react': 'Sky Example  -  React',
        'examples/projects/game': 'Sky Example  -  Showcase Game',
    },
} satisfies Sky.ConfigDescription
