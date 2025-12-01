import globalify from '@sky-modules/core/globalify'

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
        /**
         * Texture metadata including the Three.js texture and loading parameters.
         */
        export interface TextureParameters {
            /** The Three.js texture instance */
            texture: Three.Texture
            /** Scaling factor for the texture */
            factor?: number
            /** Whether texture wraps horizontally */
            wrapX?: boolean
            /** Whether texture wraps vertically */
            wrapY?: boolean
        }

        /**
         * Parameters for loading a texture.
         */
        export interface LoadTextureParameters {
            /** Scaling factor for the texture */
            factor?: number
            /** Whether texture wraps horizontally */
            wrapX?: boolean
            /** Whether texture wraps vertically */
            wrapY?: boolean
        }
    }

    /**
     * Asset management system for loading and tracking Three.js textures.
     *
     * AssetsManager provides centralized texture loading with progress tracking,
     * automatic caching, and configuration for texture wrapping modes.
     *
     * @example Basic texture loading
     * ```typescript
     * const assets = new Sky.AssetsManager()
     *
     * // Load a texture
     * await assets.loadTexture('logo')
     *
     * // Use the texture
     * const texture = assets.getTexture('logo')
     * material.map = texture
     * ```
     *
     * @example With wrapping and progress tracking
     * ```typescript
     * const assets = new Sky.AssetsManager()
     *
     * // Load multiple textures
     * Promise.all([
     *   assets.loadTexture('floor', { wrapX: true, wrapY: true }),
     *   assets.loadTexture('wall', { factor: 2 }),
     *   assets.loadTexture('ceiling')
     * ])
     *
     * // Monitor loading progress
     * const interval = setInterval(() => {
     *   console.log(`Loading: ${(assets.progress * 100).toFixed(0)}%`)
     *   if (assets.progress === 1) {
     *     clearInterval(interval)
     *     console.log('All assets loaded!')
     *   }
     * }, 100)
     * ```
     *
     * @example Accessing texture parameters
     * ```typescript
     * const params = assets.getTextureParameters('logo')
     * console.log(`Texture factor: ${params.factor}`)
     * console.log(`Wraps X: ${params.wrapX}`)
     * ```
     */
    export class AssetsManager {
        /** Three.js texture loader instance */
        readonly textureLoader: Three.TextureLoader
        /** Loading progress from 0 to 1 (1 = all assets loaded) */
        progress: number = 1

        constructor() {
            this.textureLoader = new Three.TextureLoader()
        }

        /**
         * Retrieves a loaded texture by name.
         *
         * @param name Texture identifier (filename without extension)
         * @returns The Three.js texture instance
         * @throws Error if texture hasn't been loaded
         */
        getTexture(name: string): Three.Texture {
            return this.__textures[name].texture
        }

        /**
         * Retrieves texture metadata including the texture and loading parameters.
         *
         * @param name Texture identifier
         * @returns Texture parameters object
         */
        getTextureParameters(name: string): AssetsManager.TextureParameters {
            return this.__textures[name]
        }

        /**
         * Loads a texture from the /images directory.
         *
         * Textures are loaded as PNG files from /images/{name}.png.
         * Progress is tracked and accessible via the progress property.
         *
         * @param name Texture identifier (filename without extension)
         * @param parameters Loading configuration (wrapping, scaling)
         * @returns Promise resolving to the loaded texture, or void on error
         *
         * @example
         * ```typescript
         * await assets.loadTexture('brick', {
         *   wrapX: true,
         *   wrapY: true,
         *   factor: 2
         * })
         * ```
         */
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
