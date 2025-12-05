import '@sky-modules/cli/configuration'

export default {
    "id": "sky.platform",
    "package": "@sky-modules/platform",
    "publishable": true,
    "npm": {
        "description": "Platform-specific utilities and configurations - web/node platform detection, device helpers, breakpoints, and initialization",
        "keywords": [
            "platform",
            "web",
            "node",
            "device",
            "breakpoints",
            "detection",
            "initialization",
            "helpers"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "separateModules": [
            "node",
            "universal",
            "web"
        ],
        "dependencies": {
            "@sky-modules/core": "workspace:*"
        }
    }
} satisfies Sky.ModuleConfig
