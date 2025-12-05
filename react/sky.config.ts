import '@sky-modules/cli/configuration'

export default {
    "id": "sky.react",
    "package": "@sky-modules/react",
    "publishable": true,
    "npm": {
        "description": "React platform components and utilities",
        "keywords": [
            "react",
            "components",
            "hooks",
            "providers"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "separateModules": [
            "vike",
            "vike-integration",
            "UniversalReactAppLauncher"
        ],
        "dependencies": {
            "@sky-modules/core": "workspace:*",
            "@sky-modules/platform": "workspace:*"
        },
        "peerDependencies": {
            "react": ">=18.0.0",
            "react-dom": ">=18.0.0"
        }
    }
} satisfies Sky.ModuleConfig
