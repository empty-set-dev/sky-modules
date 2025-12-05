import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.react",
    "target": "web",
    "jsx": "react",
    "public": "playground/public",
    "mitosis": [
        "jsx",
        "universal",
        "design",
        "Canvas",
        "Three",
        "vike"
    ]
} satisfies Sky.AppConfig
