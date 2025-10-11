import '@sky-modules/cli/configuration/Sky.App.global'
import '@sky-modules/cli/configuration/Sky.Config.global'

const platformExamples: Record<string, Sky.AppDescription> = {
    'playground/node': {
        id: 'sky.playground.node',
        target: 'node',
    },
    'playground/qwik': {
        id: 'sky.playground.qwik',
        target: 'web',
        jsx: 'qwik',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three'],
    },
    'playground/svelte': {
        id: 'sky.playground.svelte',
        target: 'web',
        jsx: 'svelte',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three', 'vike'],
    },
    'playground/solid': {
        id: 'sky.playground.solid',
        target: 'web',
        jsx: 'solid',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three', 'vike'],
    },
    'playground/vue': {
        id: 'sky.playground.vue',
        target: 'web',
        jsx: 'vue',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three', 'vike'],
    },
    'playground/angular': {
        id: 'sky.playground.angular',
        target: 'web',
        jsx: 'angular',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three', 'vike'],
    },
    'playground/react': {
        id: 'sky.playground.react',
        target: 'web',
        jsx: 'react',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three', 'vike'],
    },
    'playground/universal': {
        id: 'sky.playground.universal',
        target: 'universal',
        jsx: 'react',
        public: 'playground/public',
        mitosis: ['universal', 'design', 'Canvas', 'Three'],
    },
}

const featuresExamples: Record<string, Sky.AppDescription> = {
    'playground/features/ecs': {
        id: 'sky.playground.features.ecs',
        target: 'universal',
        public: 'playground/public',
    },

    'playground/features/effect': {
        id: 'sky.playground.features.effect',
        target: 'universal',
        public: 'playground/public',
    },
}

export default {
    name: 'Sky Modules',
    id: 'sky',
    modules: {},
    playground: {
        ...platformExamples,
        ...featuresExamples,
        'playground/projects/game': {
            id: 'sky.playground.projects.game',
            target: 'universal',
            public: 'playground/public',
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
        behavior: 'Sky ~ Behavior',
        Canvas: 'Sky · Canvas',
        Three: 'Sky · Three',
        vike: 'Sky · Vike',
        qwik: 'Sky · Qwik',
        solid: 'Sky · Solid',
        svelte: 'Sky · Svelte',
        vue: 'Sky · Vue',
        angular: 'Sky · Angular',
        react: 'Sky · React',
        playground: 'Sky Playground',
        '../sky-modules-workspace-example': 'Sky Playground  -  Workspace',
        'playground/Canvas': 'Sky Playground  -  Canvas',
        'playground/Three': 'Sky Playground  -  Three',
        'playground/node': 'Sky Playground  -  Node',
        'playground/universal': 'Sky Playground  -  Universal',
        'playground/qwik': 'Sky Playground  -  Qwik',
        'playground/solid': 'Sky Playground  -  Solid',
        'playground/svelte': 'Sky Playground  -  Svelte',
        'playground/vue': 'Sky Playground  -  Vue',
        'playground/angular': 'Sky Playground  -  Angular',
        'playground/react': 'Sky Playground  -  React',
        'playground/projects/game': 'Sky Playground  -  Showcase Game',
    },
} satisfies Sky.ConfigDescription
