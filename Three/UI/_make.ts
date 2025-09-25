import { TextView } from 'pkgs/troika-three-text'
import globalify from 'sky/standard/globalify'

declare global {
    namespace UI {
        export interface MakeRoundedRectTextureParameters {
            w: number
            h: number
            radius: number
            color: number
            opacity?: number
            strokeColor: number
            strokeWidth: number
            pixelRatio?: number
            rounded?: 'all' | 'top' | 'bottom'
        }
        function makeRoundedRectTexture(params: UI.MakeRoundedRectTextureParameters): Three.Texture

        export interface MakeTextParameters {
            text: string
            anchorX?: number | string
            anchorY?: number | string
            clipRect?: [number, number, number, number]
            color?: number
            curveRadius?: number
            depthOffset?: number
            direction?: string
            fillOpacity?: number
            font?: string
            fontSize?: number
            fontStyle?: string
            fontWeight?: string
            glyphGeometryDetail?: number
            gpuAccelerateSDF?: boolean
            letterSpacing?: number
            lineHeight?: number | string
            material?: Three.Material
            maxWidth?: number
            outlineBlur?: number | string
            outlineColor?: number
            outlineOffsetX?: number
            outlineOffsetY?: number
            outlineOpacity?: number
            outlineWidth?: number | string
            overflowWrap?: 'normal' | 'break-word'
            sdfGlyphSize?: number
            strokeColor?: number
            strokeOpacity?: number
            strokeWidth?: number | string
            textAlign?: 'left' | 'right' | 'center' | 'justify'
            textIndent?: number
            unicodeFontsUrl?: string
            whiteSpace?: 'normal' | 'nowrap'
        }
        function makeText(params: UI.MakeTextParameters): TextView
    }
}

namespace lib {
    export function makeRoundedRectTexture(
        parameters: UI.MakeRoundedRectTextureParameters
    ): Three.Texture {
        const root = new EffectsRoot()
        const canvas = new Canvas(root, {
            size: (): [number, number] => [
                (parameters.w + parameters.strokeWidth) * canvas.pixelRatio,
                (parameters.h + parameters.strokeWidth) * canvas.pixelRatio,
            ],
        })

        const drawParameters = {
            x: parameters.strokeWidth / 2,
            y: parameters.strokeWidth / 2,
            w: parameters.w,
            h: parameters.h,
            radius: parameters.radius * canvas.pixelRatio,
            color:
                new Three.Color(parameters.color).getStyle().slice(0, -1) +
                ',' +
                (parameters.opacity ?? 1).toString() +
                ')',
            strokeColor: new Three.Color(parameters.strokeColor).getStyle(),
            strokeWidth: parameters.strokeWidth,
        }

        if (parameters.rounded === 'top') {
            canvas.drawTopRoundedRect(drawParameters)
        } else if (parameters.rounded === 'bottom') {
            canvas.drawBottomRoundedRect(drawParameters)
        } else {
            canvas.drawRoundedRect(drawParameters)
        }

        const texture = new Three.CanvasTexture(canvas.domElement)
        root.destroy()
        return texture
    }

    export function makeText(params: UI.MakeTextParameters): TextView {
        const textView = new TextView()

        const { anchorX, anchorY, color, fontSize, ...otherParams } = params

        textView.anchorX = anchorX ?? 'center'
        textView.anchorY = anchorY ?? 'middle'
        textView.color = color ?? 0x000000
        textView.fontSize = fontSize ?? 16

        Object.keys(otherParams).forEach(k => {
            ;(textView as never)[k] = (otherParams as never)[k]
        })

        return textView
    }
}

globalify.namespace('UI', lib)
