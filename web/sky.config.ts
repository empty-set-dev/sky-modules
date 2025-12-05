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
        "dependencies": [],
        "peerDependencies": [
            "react",
            "react-dom",
            "react-i18next",
            "i18next"
        ]
    }
} satisfies Sky.ModuleConfig
