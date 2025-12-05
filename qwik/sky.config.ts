import '@sky-modules/cli/configuration'

export default {
    "id": "sky.qwik",
    "package": "@sky-modules/qwik",
    "publishable": true,
    "npm": {
        "description": "Qwik platform components and utilities",
        "keywords": [
            "qwik",
            "components",
            "utilities"
        ],
        "access": "public",
        "modules": [
            "Box"
        ],
        "dependencies": {
            "@sky-modules/core": "workspace:*",
            "@sky-modules/platform": "workspace:*"
        },
        "peerDependencies": {
            "@builder.io/qwik": ">=1.0.0"
        }
    }
} satisfies Sky.ModuleConfig
