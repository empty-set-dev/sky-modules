import { Geometry } from './Geometry'

export interface SplinePoint {
    x: number
    y: number
    cp1x?: number // control point 1 x
    cp1y?: number // control point 1 y
    cp2x?: number // control point 2 x
    cp2y?: number // control point 2 y
}

export type SplineType = 'quadratic' | 'cubic' | 'smooth'

export class SplineGeometry extends Geometry {
    constructor(
        public points: SplinePoint[] = [],
        public type: SplineType = 'smooth',
        public tension: number = 0.5,
        public closed: boolean = true
    ) {
        super()
    }

    addPoint(x: number, y: number, cp1x?: number, cp1y?: number, cp2x?: number, cp2y?: number): this {
        this.points.push({ x, y, cp1x, cp1y, cp2x, cp2y })
        return this
    }

    addPoints(...points: SplinePoint[]): this {
        this.points.push(...points)
        return this
    }

    setPoints(points: SplinePoint[]): this {
        this.points = [...points]
        return this
    }

    setType(type: SplineType): this {
        this.type = type
        return this
    }

    setTension(tension: number): this {
        this.tension = Math.max(0, Math.min(1, tension))
        return this
    }

    setClosed(closed: boolean): this {
        this.closed = closed
        return this
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        if (this.points.length < 2) {
            return // Need at least 2 points for a curve
        }

        const scaledPoints = this.points.map(p => ({
            x: p.x * pixelRatio,
            y: p.y * pixelRatio,
            cp1x: p.cp1x ? p.cp1x * pixelRatio : undefined,
            cp1y: p.cp1y ? p.cp1y * pixelRatio : undefined,
            cp2x: p.cp2x ? p.cp2x * pixelRatio : undefined,
            cp2y: p.cp2y ? p.cp2y * pixelRatio : undefined,
        }))

        ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y)

        switch (this.type) {
            case 'quadratic':
                this.drawQuadraticSpline(ctx, scaledPoints)
                break
            case 'cubic':
                this.drawCubicSpline(ctx, scaledPoints)
                break
            case 'smooth':
                this.drawSmoothSpline(ctx, scaledPoints)
                break
        }

        // Close path only if closed = true
        if (this.closed) {
            ctx.closePath()
        }
    }

    private drawQuadraticSpline(ctx: CanvasRenderingContext2D, points: SplinePoint[]): void {
        for (let i = 1; i < points.length; i++) {
            const current = points[i]
            const prev = points[i - 1]

            // Use control point if available, otherwise midpoint
            const cpx = current.cp1x ?? (prev.x + current.x) / 2
            const cpy = current.cp1y ?? (prev.y + current.y) / 2

            ctx.quadraticCurveTo(cpx, cpy, current.x, current.y)
        }

        // Closing curve to first point only for closed splines
        if (this.closed) {
            const first = points[0]
            const last = points[points.length - 1]
            const cpx = last.cp2x ?? (last.x + first.x) / 2
            const cpy = last.cp2y ?? (last.y + first.y) / 2
            ctx.quadraticCurveTo(cpx, cpy, first.x, first.y)
        }
    }

    private drawCubicSpline(ctx: CanvasRenderingContext2D, points: SplinePoint[]): void {
        for (let i = 1; i < points.length; i++) {
            const current = points[i]
            const prev = points[i - 1]

            // Use control points if available, otherwise calculate them
            const cp1x = prev.cp2x ?? prev.x + (current.x - prev.x) * this.tension
            const cp1y = prev.cp2y ?? prev.y + (current.y - prev.y) * this.tension
            const cp2x = current.cp1x ?? current.x - (current.x - prev.x) * this.tension
            const cp2y = current.cp1y ?? current.y - (current.y - prev.y) * this.tension

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y)
        }

        // Closing curve to first point only for closed splines
        if (this.closed) {
            const first = points[0]
            const last = points[points.length - 1]
            const cp1x = last.cp2x ?? last.x + (first.x - last.x) * this.tension
            const cp1y = last.cp2y ?? last.y + (first.y - last.y) * this.tension
            const cp2x = first.cp1x ?? first.x - (first.x - last.x) * this.tension
            const cp2y = first.cp1y ?? first.y - (first.y - last.y) * this.tension
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y)
        }
    }

    private drawSmoothSpline(ctx: CanvasRenderingContext2D, points: SplinePoint[]): void {
        // Catmull-Rom spline for smooth curves
        const smoothPoints = this.generateSmoothControlPoints(points)

        for (let i = 1; i < points.length; i++) {
            const current = points[i]
            const smooth = smoothPoints[i - 1]

            ctx.bezierCurveTo(
                smooth.cp1x, smooth.cp1y,
                smooth.cp2x, smooth.cp2y,
                current.x, current.y
            )
        }

        // Closing curve only for closed splines
        if (this.closed) {
            const lastSmooth = smoothPoints[smoothPoints.length - 1]
            ctx.bezierCurveTo(
                lastSmooth.cp1x, lastSmooth.cp1y,
                lastSmooth.cp2x, lastSmooth.cp2y,
                points[0].x, points[0].y
            )
        }
    }

    private generateSmoothControlPoints(points: SplinePoint[]): Array<{ cp1x: number; cp1y: number; cp2x: number; cp2y: number }> {
        const result = []
        const len = points.length

        for (let i = 0; i < len; i++) {
            let p0: SplinePoint, p1: SplinePoint, p2: SplinePoint, p3: SplinePoint

            if (this.closed) {
                // For closed splines, wrap around to create smooth curves
                p0 = points[(i - 1 + len) % len]
                p1 = points[i]
                p2 = points[(i + 1) % len]
                p3 = points[(i + 2) % len]
            } else {
                // For open splines, handle edge cases
                p1 = points[i]
                p2 = points[Math.min(i + 1, len - 1)]

                if (i === 0) {
                    p0 = points[0] // Use first point as p0 for first segment
                } else {
                    p0 = points[i - 1]
                }

                if (i === len - 1) {
                    p3 = points[len - 1] // Use last point as p3 for last segment
                } else {
                    p3 = points[Math.min(i + 2, len - 1)]
                }
            }

            // Calculate control points for smooth curve
            const tension = this.tension * 0.5

            const cp1x = p1.x + (p2.x - p0.x) * tension
            const cp1y = p1.y + (p2.y - p0.y) * tension
            const cp2x = p2.x - (p3.x - p1.x) * tension
            const cp2y = p2.y - (p3.y - p1.y) * tension

            result.push({ cp1x, cp1y, cp2x, cp2y })
        }

        return result
    }

    clone(): SplineGeometry {
        return new SplineGeometry([...this.points], this.type, this.tension, this.closed)
    }

    // Helper methods for creating common splines
    static createEllipticalSpline(
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        points: number = 8
    ): SplineGeometry {
        if (points < 3) {
            throw new Error('Elliptical spline must have at least 3 points')
        }

        const splinePoints: SplinePoint[] = []
        const angleStep = (Math.PI * 2) / points

        for (let i = 0; i < points; i++) {
            const angle = i * angleStep
            const x = centerX + Math.cos(angle) * radiusX
            const y = centerY + Math.sin(angle) * radiusY
            splinePoints.push({ x, y })
        }

        return new SplineGeometry(splinePoints, 'smooth', 0.4)
    }

    static createWaveSpline(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        amplitude: number,
        frequency: number = 3
    ): SplineGeometry {
        const splinePoints: SplinePoint[] = []
        const points = frequency * 4 + 1

        for (let i = 0; i < points; i++) {
            const t = i / (points - 1)
            const x = startX + (endX - startX) * t
            const baseY = startY + (endY - startY) * t
            const waveY = baseY + Math.sin(t * Math.PI * 2 * frequency) * amplitude
            splinePoints.push({ x, y: waveY })
        }

        return new SplineGeometry(splinePoints, 'smooth', 0.3)
    }

    static createHeartSpline(centerX: number, centerY: number, size: number): SplineGeometry {
        const splinePoints: SplinePoint[] = []
        const points = 16

        for (let i = 0; i < points; i++) {
            const t = (i / points) * Math.PI * 2
            // Parametric equation for heart shape
            const x = centerX + size * (16 * Math.pow(Math.sin(t), 3))
            const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
            splinePoints.push({ x: x / 16, y: y / 16 })
        }

        return new SplineGeometry(splinePoints, 'smooth', 0.4)
    }
}