import '@sky-modules/cli/configuration'

export default {
    "id": "sky.vike",
    "package": "@sky-modules/vike",
    "publishable": true,
    "npm": {
        "description": "",
        "keywords": [],
        "access": "public",
        "modules": [
            "."
        ],
        "separateModules": [
            "async-data",
            "config"
        ]
    }
} satisfies Sky.ModuleConfig
