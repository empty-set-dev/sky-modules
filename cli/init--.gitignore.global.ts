import globalify from '@sky-modules/core/globalify'

import initGitIgnore, * as imports from './init--.gitignore'

declare global {
    const initGitIgnore: typeof imports.default
    type initGitIgnore = typeof imports.default
}

globalify({ initGitIgnore })
