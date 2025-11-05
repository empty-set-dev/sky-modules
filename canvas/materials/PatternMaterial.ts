import { Material, MaterialParameters } from './Material'

export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

export interface PatternMaterialParameters extends MaterialParameters {
    pattern?: CanvasPattern
    image?: CanvasImageSource
    repetition?: PatternRepetition
    scale?: number
    rotation?: number
    offsetX?: number
    offsetY?: number
}

export class PatternMaterial extends Material {
    pattern: CanvasPattern
    scale: number
    rotation: number
    offsetX: number
    offsetY: number

    constructor(parameters: PatternMaterialParameters) {
        super(parameters)

        if (parameters.pattern) {
            this.pattern = parameters.pattern
        } else if (parameters.image) {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')!
            this.pattern = tempCtx.createPattern(
                parameters.image,
                parameters.repetition ?? 'repeat'
            )!
        } else {
            throw new Error('PatternMaterial requires either pattern or image parameter')
        }

        this.scale = parameters.scale ?? 1
        this.rotation = parameters.rotation ?? 0
        this.offsetX = parameters.offsetX ?? 0
        this.offsetY = parameters.offsetY ?? 0
    }

    static fromImage(
        image: CanvasImageSource,
        repetition: PatternRepetition = 'repeat',
        options: Omit<PatternMaterialParameters, 'image' | 'pattern' | 'repetition'> = {}
    ): PatternMaterial {
        return new PatternMaterial({
            image,
            repetition,
            ...options,
        })
    }

    apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        super.apply(ctx, pixelRatio)

        // Apply transformations to pattern if needed
        if (this.scale !== 1 || this.rotation !== 0 || this.offsetX !== 0 || this.offsetY !== 0) {
            const matrix = new DOMMatrix()
            matrix.translateSelf(this.offsetX * pixelRatio, this.offsetY * pixelRatio)
            matrix.rotateSelf(this.rotation * (180 / Math.PI))
            matrix.scaleSelf(this.scale, this.scale)
            this.pattern.setTransform(matrix)
        }

        ctx.fillStyle = this.pattern
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fill()
    }

    clone(): PatternMaterial {
        return new PatternMaterial({
            pattern: this.pattern,
            scale: this.scale,
            rotation: this.rotation,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            color: this.color,
            opacity: this.opacity,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineDash: this.lineDash,
            lineDashOffset: this.lineDashOffset,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            globalCompositeOperation: this.globalCompositeOperation,
        })
    }
}
