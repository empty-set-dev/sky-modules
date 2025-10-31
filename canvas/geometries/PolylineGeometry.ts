import { Geometry } from './Geometry'

export interface Point {
    x: number
    y: number
}

export interface PolylineGeometryProps {
    points?: Point[]
    closed?: boolean
}

export class PolylineGeometry extends Geometry {
    public points: Point[]
    public closed: boolean

    constructor(props: PolylineGeometryProps = {}) {
        super()
        this.points = props.points ?? []
        this.closed = props.closed ?? true
    }

    addPoint(x: number, y: number): this {
        this.points.push({ x, y })
        return this
    }

    addPoints(...points: Point[]): this {
        this.points.push(...points)
        return this
    }

    setPoints(points: Point[]): this {
        this.points = [...points]
        return this
    }

    setClosed(closed: boolean): this {
        this.closed = closed
        return this
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        if (this.points.length < 2) {
            return // Нужно минимум 2 точки для линии
        }

        const firstPoint = this.points[0]
        ctx.moveTo(firstPoint.x * pixelRatio, firstPoint.y * pixelRatio)

        for (let i = 1; i < this.points.length; i++) {
            const point = this.points[i]
            ctx.lineTo(point.x * pixelRatio, point.y * pixelRatio)
        }

        // Замыкаем только если closed = true
        if (this.closed) {
            ctx.closePath()
        }
    }

    clone(): PolylineGeometry {
        return new PolylineGeometry({ points: [...this.points], closed: this.closed })
    }

    // Вспомогательные методы для создания стандартных фигур
    static createRegularPolygon(
        centerX: number,
        centerY: number,
        radius: number,
        sides: number,
        rotation: number = 0
    ): PolylineGeometry {
        if (sides < 3) {
            throw new Error('Polygon must have at least 3 sides')
        }

        const points: Point[] = []
        const angleStep = (Math.PI * 2) / sides

        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep + rotation
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
            })
        }

        return new PolylineGeometry({ points, closed: true }) // Замкнутый полигон
    }

    static createTriangle(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number
    ): PolylineGeometry {
        return new PolylineGeometry({
            points: [
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: x3, y: y3 },
            ],
            closed: true,
        }) // Замкнутый треугольник
    }

    static createStar(
        centerX: number,
        centerY: number,
        outerRadius: number,
        innerRadius: number,
        points: number = 5,
        rotation: number = 0
    ): PolylineGeometry {
        if (points < 3) {
            throw new Error('Star must have at least 3 points')
        }

        const vertices: Point[] = []
        const angleStep = (Math.PI * 2) / (points * 2)

        for (let i = 0; i < points * 2; i++) {
            const angle = i * angleStep + rotation
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            vertices.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
            })
        }

        return new PolylineGeometry({ points: vertices, closed: true }) // Замкнутая звезда
    }

    static createPath(points: Point[]): PolylineGeometry {
        return new PolylineGeometry({ points, closed: false }) // Открытый путь
    }

    static createLine(x1: number, y1: number, x2: number, y2: number): PolylineGeometry {
        return new PolylineGeometry({
            points: [
                { x: x1, y: y1 },
                { x: x2, y: y2 },
            ],
            closed: false,
        }) // Простая линия
    }

    static createPolyline(points: Point[]): PolylineGeometry {
        return new PolylineGeometry({ points, closed: false }) // Открытая ломаная
    }

    static createPolygon(points: Point[]): PolylineGeometry {
        return new PolylineGeometry({ points, closed: true }) // Замкнутый полигон
    }
}
