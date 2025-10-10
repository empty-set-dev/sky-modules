// Pure JSX Canvas API - главный экспорт
// Полностью автономная система без React зависимостей!

// JSX Runtime
export { jsx, jsxs, jsxDEV, Fragment } from './jsx-runtime'
export type { VNode } from './jsx-runtime'

// Рендерер
export { render, renderer, component, CanvasRenderer } from './renderer'

// Реактивная система
export {
    signal,
    computed,
    effect,
    onFrame,
    frameLoop,
    reactive,
    spring,
    tween,
    easing,
    animate,
    clock,
    Timeline
} from '@sky-modules/behavior/reactive'
export type {
    Signal,
    Computed,
    SpringConfig,
    TweenConfig,
    TweenControls
} from '@sky-modules/behavior/reactive'


// Типы для JSX элементов
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Canvas
            canvas: {
                dep?: any
                size?: () => [number, number]
                pixelRatio?: number
                onCreated?: (canvas: any) => void
                onMouseMove?: (e: MouseEvent) => void
                onMouseDown?: (e: MouseEvent) => void
                onMouseUp?: (e: MouseEvent) => void
                onClick?: (e: MouseEvent) => void
                children?: any
            }

            // Scene
            scene: {
                background?: string
                position?: [number, number] | { x: number; y: number }
                rotation?: number
                scale?: number | [number, number] | { x: number; y: number }
                visible?: boolean
                name?: string
                id?: string
                children?: any
            }

            // Mesh
            mesh: {
                position?: [number, number] | { x: number; y: number }
                rotation?: number
                scale?: number | [number, number] | { x: number; y: number }
                visible?: boolean
                name?: string
                id?: string
                onClick?: () => void
                onPointerEnter?: () => void
                onPointerLeave?: () => void
                onPointerMove?: () => void
                style?: Record<string, any>
                children?: any
            }

            // Group
            group: {
                position?: [number, number] | { x: number; y: number }
                rotation?: number
                scale?: number | [number, number] | { x: number; y: number }
                visible?: boolean
                name?: string
                id?: string
                children?: any
            }

            // Геометрия
            rect: {
                width?: number
                height?: number
                x?: number
                y?: number
            }

            circle: {
                radius?: number
                x?: number
                y?: number
                startAngle?: number
                endAngle?: number
                counterclockwise?: boolean
            }

            ellipse: {
                radiusX?: number
                radiusY?: number
                x?: number
                y?: number
                rotation?: number
                startAngle?: number
                endAngle?: number
                counterclockwise?: boolean
            }

            path: {
                commands?: Array<any>
            }

            // Материалы
            fill: {
                color?: string
                opacity?: number
            }

            stroke: {
                color?: string
                lineWidth?: number
                opacity?: number
                lineCap?: CanvasLineCap
                lineJoin?: CanvasLineJoin
                lineDash?: number[]
                lineDashOffset?: number
            }

            gradient: {
                type?: 'linear' | 'radial'
                x0?: number
                y0?: number
                x1?: number
                y1?: number
                r0?: number
                r1?: number
                stops?: Array<{ offset: number; color: string }>
            }

            pattern: {
                image?: HTMLImageElement | HTMLCanvasElement
                repetition?: string
            }
        }
    }
}