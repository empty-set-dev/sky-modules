import dotenv from 'sky/@pkgs/dotenv'

dotenv.config()

export default {
    modules: {
        sky: {
            path: process.env.SKY_MODULES_PATH,
        },
    },
    examples: {},
    apps: {},
    scripts: {},
}
