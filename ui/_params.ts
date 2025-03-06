export {}

declare global {
    namespace UI {
        export interface TextureParams {
            w: number
            h: number
            radius: number
            color: number
            opacity: number
            strokeColor: number
            strokeWidth: number
        }

        export interface TextParams {
            text: string
            fontSize: number
            fontWeight: string
            color: number
            opacity: number
            strokeColor: number
            strokeWidth: number
        }
    }
}
