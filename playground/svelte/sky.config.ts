import '@sky-modules/cli/configuration'

export default {
    "id": "sky.playground.svelte",
    "target": "web",
    "jsx": "svelte",
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
