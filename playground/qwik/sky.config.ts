import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.qwik",
    "target": "web",
    "jsx": "qwik",
    "public": "playground/public",
    "mitosis": [
        "jsx",
        "universal",
        "design",
        "Canvas",
        "Three"
    ]
} satisfies Sky.AppConfig
