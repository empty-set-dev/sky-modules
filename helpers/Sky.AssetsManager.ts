import globalify from 'sky/standard/globalify'

declare global {
    namespace Sky {
        namespace AssetsManager {
            interface TextureParameters extends lib.AssetsManager.TextureParameters {}
            interface LoadTextureParameters extends lib.AssetsManager.LoadTextureParameters {}
        }
        class AssetsManager extends lib.AssetsManager {}
    }
}

namespace lib {
    export namespace AssetsManager {
        export interface TextureParameters {
            texture: Three.Texture
            factor?: number
            wrapX?: boolean
            wrapY?: boolean
        }
        export interface LoadTextureParameters {
            factor?: number
            wrapX?: boolean
            wrapY?: boolean
        }
    }
    export class AssetsManager {
        readonly textureLoader: Three.TextureLoader
        progress: number = 1

        constructor() {
            this.textureLoader = new Three.TextureLoader()
        }

        getTexture(name: string): Three.Texture {
            return this.__textures[name].texture
        }

        getTextureParameters(name: string): AssetsManager.TextureParameters {
            return this.__textures[name]
        }

        async loadTexture(
            name: string,
            parameters: AssetsManager.LoadTextureParameters = {}
        ): Promise<void | Three.Texture> {
            const { wrapX, wrapY } = parameters
            let { factor } = parameters
            factor ??= 1

            this.__loaders[`texture ${name}`] = 0
            this.__updateProgress()

            return this.textureLoader
                .loadAsync(`/images/${name}.png`, ev => {
                    this.__loaders[`texture ${name}`] = ev.loaded / ev.total
                    this.__updateProgress()
                })
                .then(texture => {
                    if (wrapX) {
                        texture.wrapS = Three.RepeatWrapping
                    }

                    if (wrapY) {
                        texture.wrapT = Three.RepeatWrapping
                    }

                    this.__loaders[`texture ${name}`] = 1
                    this.__updateProgress()
                    this.__textures[name] = { factor, wrapX, wrapY, texture }

                    return texture
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error(`Failed load texture "/images/${name}.png"`)
                    // eslint-disable-next-line no-console
                    console.error(error)
                })
        }

        private __updateProgress(): void {
            const loaderKeys = Object.keys(this.__loaders)

            if (loaderKeys.length === 0) {
                this.progress = 1
                return
            }

            this.progress = loaderKeys.reduce((prev, k) => {
                return prev + this.__loaders[k]
            }, 0)
            this.progress /= loaderKeys.length

            if (this.progress === 1) {
                this.__loaders = {}
            }
        }

        private __textures: Record<string, AssetsManager.TextureParameters> = {}
        private __loaders: Record<string, number> = {}
    }
}

globalify.namespace('Sky', lib)
