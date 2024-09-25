import Three, { Three as Three2 } from 'three'

export default class App extends WithCreate {
    async create() {
        const textureLoader = new Three.TextureLoader()
        const texture = await textureLoader.loadAsync('/textures/ground/broken-keramic.png')
        console.log(texture)
    }

    UI(): ReactNode {
        return null
    }
}
