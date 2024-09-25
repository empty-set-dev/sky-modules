abstract class IsProhibited {
    private IsProhibited!: void
}

type CreateClass<Instance, Args extends unknown[]> = Class<
    Instance & {
        create?(...args: Args): void | Promise<void>
    } & Create,
    [IsProhibited]
>

class Create {
    static async create<Instance, Args extends unknown[], T extends CreateClass<Instance, Args>>(
        this: T,
        ...args: Args
    ): Promise<InstanceType<T>> {
        const instance = new this(null as never)
        instance.create && (await instance.create(...args))
        return instance as InstanceType<T>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(New: IsProhibited) {
        //
    }

    get isDestroyed(): boolean {
        return !!this.__isDestroyed
    }

    get destroy(): () => Promise<void> {
        return this.__destroy as () => Promise<void>
    }

    set destroy(destroy: () => void | Promise<void>) {
        const originalDestroy = this.__destroy

        if (originalDestroy) {
            this.__destroy = async (): Promise<void> => {
                if (this.isDestroyed) {
                    return
                }

                await destroy.call(this)
                await originalDestroy.call(this)
            }
        } else {
            this.__destroy = async (): Promise<void> => {
                if (this.isDestroyed) {
                    return
                }

                await destroy.call(this)
            }
        }
    }

    private __isDestroyed?: boolean
    private async __destroy(): Promise<void> {
        this.__isDestroyed = true
    }
}

export default class App extends Create {

    async create(): Promise<void> {
        const textureLoader = new Three.TextureLoader()
        const texture = await textureLoader.loadAsync('/textures/ground/broken-keramic.png')
        console.log(texture)
    
        this.destroy = (): void => {
            console.log('App destroyed')
        }
    }

    UI(): ReactNode {
        return null
    }
}

class Boo extends App {
    async create(): Promise<void> {
        await super.create()

        this.destroy = (): void => {
            console.log('boo destroyed')
        }
    }
}

const boo = await Boo.create()
boo.destroy()
setTimeout(() => {
    console.log(boo)
})

// const root = new Root()
// new WithContext(new Root(), null, root)
