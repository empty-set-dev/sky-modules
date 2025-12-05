import '@sky-modules/cli/configuration'

export default {
    "id": "sky.helpers",
    "package": "@sky-modules/helpers",
    "publishable": true,
    "npm": {
        "description": "Helper utilities",
        "keywords": [
            "helpers",
            "utilities",
            "assets",
            "templates"
        ],
        "access": "public",
        "modules": [
            "cn",
            "Loop"
        ],
        "dependencies": {},
        "peerDependencies": {}
    }
} satisfies Sky.ModuleConfig
