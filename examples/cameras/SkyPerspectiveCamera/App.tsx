export default class App extends Effect {
    x!: number
    constructor(deps: EffectDeps) {
        super(deps)

        // const textureLoader = new Three.TextureLoader()
        // const texture = await textureLoader.loadAsync('/textures/ground/broken-keramic.png')
        // console.log(texture)

        // return async(async (): Promise<App> => {
        //     await idle(Time(1, seconds))
        //     return this
        // })
    }

    UI(): ReactNode {
        return null
    }
}

class Boo extends App {
    constructor(deps: EffectDeps) {
        super(deps)

        // return async(async (): Promise<Boo> => {
        //     const self = await this
        //     console.log('?', self)
        //     await idle(Time(1, seconds))
        //     return this
        // })
    }

    superCall(): void {
        this.x = 10
    }

    onTestContext(): void {
        this.x = 10
        this.superCall()
    }
}

const root = new (class extends EffectsRoot {
    static context = 'TestContext'
})()

const boo = await new Boo(root)

console.log('boo', boo)

// class Boo extends App {
//     async create(): Promise<void> {
//         await super.create()

//         this.destroy = (): void => {
//             console.log('boo destroyed')
//         }
//     }
// }

// const root = new Root()
// new WithContext(new Root(), null, root)
