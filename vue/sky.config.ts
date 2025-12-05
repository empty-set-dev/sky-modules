import '@sky-modules/cli/configuration'

export default {
    "id": "sky.vue",
    "package": "@sky-modules/vue",
    "publishable": true,
    "npm": {
        "description": "Vue platform components and utilities",
        "keywords": [
            "vue",
            "components",
            "utilities"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "dependencies": {
            "@sky-modules/core": "workspace:*",
            "@sky-modules/platform": "workspace:*"
        },
        "peerDependencies": {
            "vue": ">=3.0.0"
        }
    }
} satisfies Sky.ModuleConfig
