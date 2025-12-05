import '@sky-modules/cli/configuration'

export default {
    "id": "sky.math",
    "package": "@sky-modules/math",
    "publishable": true,
    "npm": {
        "description": "Mathematical utilities and vector operations for 2D/3D graphics and scientific computing",
        "keywords": [
            "math",
            "vector",
            "2d",
            "3d",
            "graphics",
            "linear-algebra",
            "geometry"
        ],
        "access": "public",
        "modules": [
            "."
        ],
        "dependencies": {},
        "peerDependencies": {}
    }
} satisfies Sky.ModuleConfig
