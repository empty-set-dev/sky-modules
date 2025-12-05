import '@sky-modules/cli/configuration'

export default {
    "id": "sky.web",
    "package": "@sky-modules/web",
    "publishable": true,
    "npm": {
        "description": "Web platform utilities and components",
        "keywords": [
            "web",
            "browser",
            "react",
            "hooks",
            "renderer"
        ],
        "access": "public",
        "modules": [
            "HTML_TAGS"
        ],
        "dependencies": {
            "@sky-modules/core": "workspace:*",
            "@sky-modules/platform": "workspace:*"
        },
        "peerDependencies": {
            "react": ">=18.0.0",
            "react-dom": ">=18.0.0",
            "react-i18next": ">=11.0.0",
            "i18next": ">=21.0.0"
        }
    }
} satisfies Sky.ModuleConfig
