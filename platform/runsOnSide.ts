iAm('runsOnSide', import('./runsOnSide'))

declare global {
    interface Modules {
        runsOnSide: typeof import('./runsOnSide')
    }
}

export const runsOnSide = typeof window === 'undefined' ? 'server' : 'client'
export const runsOnServerSide = runsOnSide === 'server'
export const runsOnClientSide = runsOnSide === 'client'
