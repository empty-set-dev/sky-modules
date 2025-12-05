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
        "dependencies": [],
        "peerDependencies": [
            "react",
            "react-dom"
        ]
    }
} satisfies Sky.ModuleConfig
