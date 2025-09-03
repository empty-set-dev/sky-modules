iAm('sky.react.InitReactSpa', import('.'), {
    needs: ['sky.standard'],
})

declare global {
    interface Modules {
        'sky.react.InitReactSpa': typeof import('.')
    }
}

export * from './_initReactSpa'
export { default } from './_initReactSpa'
