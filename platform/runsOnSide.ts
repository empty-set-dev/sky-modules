iAm('runsOnSide', import('./runsOnSide'))

declare global {
    interface Modules {
        runsOnSide: typeof import('./runsOnSide')
    }
}

export const runsOnServerSide = typeof window === 'undefined'
export const runsOnClientSide = !runsOnServerSide
