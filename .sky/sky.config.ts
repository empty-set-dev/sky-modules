import 'sky/configuration/Sky.App.global'
import 'sky/configuration/Sky.Config.global'

const pkgsExamples: Record<string, Sky.AppDescription> = {}

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
    },
    'examples/svelte': {
        id: 'sky.examples.svelte',
        target: 'web',
        jsx: 'svelte',
        public: 'examples/public',
    },
    'examples/solid': {
        id: 'sky.examples.solid',
        target: 'web',
        jsx: 'solid',
        public: 'examples/public',
    },
    'examples/vue': {
        id: 'sky.examples.qwik',
        target: 'web',
        jsx: 'vue',
        public: 'examples/public',
    },
    'examples/react': {
        id: 'sky.examples.react',
        target: 'web',
        jsx: 'react',
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
        cli: 'Sky CLI',
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
        'examples/projects/game': 'Sky Example  -  Showcase Game',
    },
} satisfies Sky.ConfigDescription
