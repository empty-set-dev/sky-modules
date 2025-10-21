import '@sky-modules/cli/configuration/Sky.App.namespace.ts'
import '@sky-modules/cli/configuration/Sky.Config.namespace.ts'

export default {
    name: 'Sky Modules',
    id: 'sky',
    modules: {
        cli: {
            id: 'sky.cli',
            package: '@sky-modules/cli',
        },
        'pkgs/react-global': {
            id: 'sky.pkgs.react-global',
            package: '@sky-modules/react-global',
        },
        platform: {
            id: 'sky.platform',
            package: '@sky-modules/platform',
        },
        universal: {
            id: 'sky.universal',
            package: '@sky-modules/universal',
        },
        web: {
            id: 'sky.web',
            package: '@sky-modules/web',
        },
        core: {
            id: 'sky.core',
            package: '@sky-modules/core',
        },
        crypto: {
            id: 'sky.crypto',
            package: '@sky-modules/crypto',
        },
        database: {
            id: 'sky.database',
            package: '@sky-modules/database',
        },
        serverless: {
            id: 'sky.serverless',
            package: '@sky-modules/serverless',
        },
        utilities: {
            id: 'sky.utilities',
            package: '@sky-modules/utilities',
        },
        helpers: {
            id: 'sky.helpers',
            package: '@sky-modules/helpers',
        },
        modules: {
            id: 'sky.modules',
            package: '@sky-modules/modules',
        },
        features: {
            id: 'sky.features',
            package: '@sky-modules/features',
        },
        effects: {
            id: 'sky.effects',
            package: '@sky-modules/effects',
        },
        ecs: {
            id: 'sky.ecs',
            package: '@sky-modules/ecs',
        },
        math: {
            id: 'sky.math',
            package: '@sky-modules/math',
        },
        design: {
            id: 'sky.design',
            package: '@sky-modules/design',
        },
        behavior: {
            id: 'sky.behavior',
            package: '@sky-modules/behavior',
        },
        Canvas: {
            id: 'sky.canvas',
            package: '@sky-modules/Canvas',
        },
        Three: {
            id: 'sky.three',
            package: '@sky-modules/Three',
        },
        vike: {
            id: 'sky.vike',
            package: '@sky-modules/vike',
        },
        qwik: {
            id: 'sky.qwik',
            package: '@sky-modules/qwik',
        },
        solid: {
            id: 'sky.solid',
            package: '@sky-modules/solid',
        },
        svelte: {
            id: 'sky.svelte',
            package: '@sky-modules/svelte',
        },
        vue: {
            id: 'sky.vue',
            package: '@sky-modules/vue',
        },
        angular: {
            id: 'sky.angular',
            package: '@sky-modules/angular',
        },
        react: {
            id: 'sky.react',
            package: '@sky-modules/react',
        },
    },
    playgrounds: {
        'playground/node': {
            id: 'sky.playground.node',
            target: 'node',
        },
        'playground/qwik': {
            id: 'sky.playground.qwik',
            target: 'web',
            jsx: 'qwik',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three'],
        },
        'playground/svelte': {
            id: 'sky.playground.svelte',
            target: 'web',
            jsx: 'svelte',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three', 'vike'],
        },
        'playground/solid': {
            id: 'sky.playground.solid',
            target: 'web',
            jsx: 'solid',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three', 'vike'],
        },
        'playground/vue': {
            id: 'sky.playground.vue',
            target: 'web',
            jsx: 'vue',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three', 'vike'],
        },
        'playground/angular': {
            id: 'sky.playground.angular',
            target: 'web',
            jsx: 'angular',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three', 'vike'],
        },
        'playground/react': {
            id: 'sky.playground.react',
            target: 'web',
            jsx: 'react',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three', 'vike'],
        },
        'playground/universal': {
            id: 'sky.playground.universal',
            target: 'universal',
            jsx: 'react',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three'],
        },
        'playground/Canvas': {
            id: 'sky.playground.canvas',
            target: 'universal',
            jsx: 'sky',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three'],
        },
        'playground/Three': {
            id: 'sky.playground.three',
            target: 'universal',
            jsx: 'sky',
            public: 'playground/public',
            mitosis: ['jsx', 'universal', 'design', 'Canvas', 'Three'],
        },

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
