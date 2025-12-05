import '@sky-modules/cli/configuration'

export default {
    "id": "sky.solid",
    "package": "@sky-modules/solid",
    "publishable": true,
    "npm": {
        "description": "Solid platform components and utilities",
        "keywords": [
            "solid",
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
            "solid-js": ">=1.0.0"
        }
    }
} satisfies Sky.ModuleConfig
