import '@sky-modules/cli/configuration'

export default {
    "id": "sky.pkgs.react-global",
    "package": "@sky-modules/react-global",
    "publishable": true,
    "npm": {
        "description": "Global React utilities and hooks with UI capturing functionality",
        "keywords": [
            "react",
            "hooks",
            "global",
            "ui",
            "capture"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "dependencies": [],
        "peerDependencies": [
            "react"
        ]
    }
} satisfies Sky.ModuleConfig
