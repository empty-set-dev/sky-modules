declare module 'troika-three-text' {
    export type Text = lib.TextView
    export const Text: typeof lib.TextView
}

declare namespace lib {
    class TextView extends Three.Object3D {
        text: string
        anchorX: number | string
        anchorY: number | string
        clipRect: [number, number, number, number]
        color: number
        curveRadius: number
        depthOffset: number
        direction: string
        fillOpacity: number
        font: string
        fontSize: number
        fontStyle: string
        fontWeight: string
        glyphGeometryDetail: number
        gpuAccelerateSDF: boolean
        letterSpacing: number
        lineHeight: number | string
        material: Three.Material
        maxWidth: number
        outlineBlur: number | string
        outlineColor: number
        outlineOffsetX: number
        outlineOffsetY: number
        outlineOpacity: number
        outlineWidth: number | string
        overflowWrap: 'normal' | 'break-word'
        sdfGlyphSize: number
        strokeColor: number
        strokeOpacity: number
        strokeWidth: number | string
        textAlign: 'left' | 'right' | 'center' | 'justify'
        textIndent: number
        unicodeFontsUrl: string
        whiteSpace: 'normal' | 'nowrap'

        geometry: Three.PlaneGeometry

        sync(fn?: () => void): void

        getCaretAtPoint(): {
            x: number
            y: number
            height: number
            charIndex: number
        }
    }
}
