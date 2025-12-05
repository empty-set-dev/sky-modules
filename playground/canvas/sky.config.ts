import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.Canvas",
    "target": "universal",
    "jsx": "sky",
    "public": "playground/public",
    "mitosis": [
        "jsx",
        "universal",
        "design",
        "Canvas",
        "Three"
    ]
} satisfies Sky.AppConfig
