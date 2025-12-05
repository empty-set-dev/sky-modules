import '@sky-modules/cli/configuration'

export default {
    "id": "sky.core",
    "package": "@sky-modules/core",
    "publishable": true,
    "npm": {
        "description": "Core utilities - essential TypeScript utilities for modern development",
        "keywords": [
            "typescript",
            "utilities",
            "core",
            "namespace",
            "global",
            "merge"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "dependencies": {
            // Core has no external dependencies - pure TypeScript utilities
        }
    }
} satisfies Sky.ModuleConfig
