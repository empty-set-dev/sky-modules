import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.universal",
    "target": "universal",
    "jsx": "react",
    "public": "playground/public",
    "mitosis": [
        "jsx",
        "universal",
        "design",
        "Canvas",
        "Three"
    ]
} satisfies Sky.AppConfig
