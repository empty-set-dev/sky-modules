import '@sky-modules/cli/configuration'

export default {
    "id": "sky.cli",
    "package": "@sky-modules/cli",
    "publishable": true,
    "npm": {
        "description": "Sky CLI tools and utilities - project management, code generation, testing, and build commands",
        "keywords": [
            "cli",
            "tools",
            "build",
            "test",
            "generate",
            "mitosis",
            "commands"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "separateModules": [
            "boilerplates",
            "default-imports",
            "dev-configs",
            "mitosis",
            "test-utils",
            "utilities",
            "workspace-assets"
        ]
    }
} satisfies Sky.ModuleConfig
