import { TextView } from 'pkgs/troika-three-text'

declare global {
    namespace UI {
        export interface MakeTextureParams {
            w: number
            h: number
            radius: number
            color: number
            opacity?: number
            strokeColor: number
            strokeWidth: number
        }

        export interface MakeTextParams {
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

        function makeTexture(params: UI.MakeTextureParams): Three.Texture
        function makeText(params: UI.MakeTextParams): TextView
    }
}

namespace lib {
    export function makeTexture(params: UI.MakeTextureParams): Three.Texture {
        const ctx = document.createElement('canvas').getContext('2d')!
        ctx.canvas.width = params.w + params.strokeWidth * 2
        ctx.canvas.height = params.h + params.strokeWidth * 2
        Canvas.drawRoundedRect(ctx, {
            x: 0,
            y: 0,
            w: params.w,
            h: params.h,
            radius: params.radius,
            color:
                new Three.Color(params.color).getStyle().slice(0, -1) +
                ',' +
                (params.opacity ?? 1).toString() +
                ')',
            strokeColor: new Three.Color(params.strokeColor).getStyle(),
            strokeWidth: params.strokeWidth,
        })
        const texture = new Three.CanvasTexture(ctx.canvas)
        ctx.canvas.remove()
        return texture
    }

    export function makeText(params: UI.MakeTextParams): TextView {
        const textView = new TextView()
        textView.text = params.text
        textView.anchorX = params.anchorX ?? 'center'
        textView.anchorY = params.anchorY ?? 'middle'

        if (params.clipRect) {
            textView.clipRect = params.clipRect
        }

        textView.color = params.color ?? 0x000000
        textView.fillOpacity = params.fillOpacity ?? 1
        textView.curveRadius = params.curveRadius ?? 0
        textView.strokeColor = params.strokeColor ?? 0x000000
        textView.strokeWidth = params.strokeWidth ?? 0
        textView.strokeOpacity = params.strokeOpacity ?? 0
        textView.outlineBlur = params.outlineBlur ?? 0
        textView.outlineColor = params.outlineColor ?? 0x000000
        textView.outlineWidth = params.outlineWidth ?? 0
        textView.fontSize = params.fontSize ?? 16
        textView.fontWeight = params.fontWeight ?? 'normal'
        return textView
    }
}

Object.assign(UI, lib)
