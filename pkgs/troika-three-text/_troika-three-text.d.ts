declare module 'troika-three-text' {
    export type Text = lib.TextView
    export const Text: typeof lib.TextView
}

declare namespace lib {
    class TextView extends Three.Object3D {
        text: string
        position: Vector3
        color: number
        anchorX: number | string
        anchorY: number | string
        clipRect: [number, number, number, number]
        curveRadius: number
        outlineWidth: number
        outlineBlur: number
        outlineColor: number
        font: string
        fontSize: number
        fontWeight: string

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
