import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.solid",
    "target": "web",
    "jsx": "solid",
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
