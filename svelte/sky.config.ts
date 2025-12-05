import '@sky-modules/cli/configuration'

export default {
    "id": "sky.svelte",
    "package": "@sky-modules/svelte",
    "publishable": true,
    "npm": {
        "description": "Svelte platform components and utilities",
        "keywords": [
            "svelte",
            "components",
            "utilities"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "dependencies": [
            "svelte"
        ],
        "peerDependencies": []
    }
} satisfies Sky.ModuleConfig
