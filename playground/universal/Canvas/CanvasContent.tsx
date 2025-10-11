import {
    Mesh,
    Scene,
    Group,
    BasicMaterial,
    StrokeMaterial,
    GradientMaterial,
    CircleGeometry,
    RectGeometry,
    EllipseGeometry,
    PolylineGeometry,
    SplineGeometry
} from '@sky-modules/Canvas/jsx'
import JSX from 'sky-jsx'

export default function CanvasContent(): JSX.Element {
    // Create gradient for demonstration
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(0, 0, 100, 100)
    gradient.addColorStop(0, '#ff0000')
    gradient.addColorStop(1, '#0000ff')

    return (
        <Scene background="#f0f0f0">
            {/* Basic Geometries Row 1 */}
            <Group position={[100, 100]}>
                {/* Rectangle */}
                <Mesh position={[0, 0]}>
                    <RectGeometry width={80} height={60} />
                    <BasicMaterial color="#ff6b6b" />
                </Mesh>

                {/* Circle */}
                <Mesh position={[120, 0]}>
                    <CircleGeometry radius={40} />
                    <BasicMaterial color="#4ecdc4" />
                </Mesh>

                {/* Ellipse */}
                <Mesh position={[240, 0]}>
                    <EllipseGeometry radiusX={50} radiusY={30} />
                    <BasicMaterial color="#45b7d1" />
                </Mesh>
            </Group>

            {/* Stroke Materials Row 2 */}
            <Group position={[100, 220]}>
                {/* Stroked Rectangle */}
                <Mesh position={[0, 0]}>
                    <RectGeometry width={80} height={60} />
                    <StrokeMaterial color="#e74c3c" lineWidth={3} />
                </Mesh>

                {/* Dashed Circle */}
                <Mesh position={[120, 0]}>
                    <CircleGeometry radius={40} />
                    <StrokeMaterial color="#9b59b6" lineWidth={2} lineDash={[10, 5]} />
                </Mesh>

                {/* Gradient Ellipse */}
                <Mesh position={[240, 0]}>
                    <EllipseGeometry radiusX={50} radiusY={30} />
                    <GradientMaterial gradient={gradient} />
                </Mesh>
            </Group>

            {/* Polyline Geometries Row 3 */}
            <Group position={[100, 340]}>
                {/* Triangle (closed polyline) */}
                <Mesh position={[0, 0]}>
                    <PolylineGeometry
                        points={[
                            { x: 0, y: -30 },
                            { x: -26, y: 15 },
                            { x: 26, y: 15 }
                        ]}
                        closed={true}
                    />
                    <BasicMaterial color="#f39c12" />
                </Mesh>

                {/* Star (polyline) */}
                <Mesh position={[120, 0]}>
                    <PolylineGeometry
                        points={[
                            { x: 0, y: -35 },
                            { x: 10, y: -10 },
                            { x: 35, y: -10 },
                            { x: 15, y: 10 },
                            { x: 22, y: 35 },
                            { x: 0, y: 20 },
                            { x: -22, y: 35 },
                            { x: -15, y: 10 },
                            { x: -35, y: -10 },
                            { x: -10, y: -10 }
                        ]}
                        closed={true}
                    />
                    <StrokeMaterial color="#8e44ad" lineWidth={2} />
                </Mesh>

                {/* Open path */}
                <Mesh position={[240, 0]}>
                    <PolylineGeometry
                        points={[
                            { x: -30, y: 20 },
                            { x: -10, y: -20 },
                            { x: 10, y: 20 },
                            { x: 30, y: -20 }
                        ]}
                        closed={false}
                    />
                    <StrokeMaterial color="#27ae60" lineWidth={3} lineCap="round" />
                </Mesh>
            </Group>

            {/* Spline Geometries Row 4 */}
            <Group position={[100, 460]}>
                {/* Smooth spline (closed) */}
                <Mesh position={[0, 0]}>
                    <SplineGeometry
                        points={[
                            { x: 0, y: -30 },
                            { x: 30, y: 0 },
                            { x: 0, y: 30 },
                            { x: -30, y: 0 }
                        ]}
                        type="smooth"
                        tension={0.4}
                        closed={true}
                    />
                    <BasicMaterial color="#e67e22" />
                </Mesh>

                {/* Cubic spline (open) */}
                <Mesh position={[120, 0]}>
                    <SplineGeometry
                        points={[
                            { x: -35, y: 20 },
                            { x: -15, y: -25 },
                            { x: 15, y: 25 },
                            { x: 35, y: -20 }
                        ]}
                        type="cubic"
                        tension={0.3}
                        closed={false}
                    />
                    <StrokeMaterial color="#c0392b" lineWidth={3} />
                </Mesh>

                {/* Quadratic spline */}
                <Mesh position={[240, 0]}>
                    <SplineGeometry
                        points={[
                            { x: -25, y: 0 },
                            { x: 0, y: -25 },
                            { x: 25, y: 0 },
                            { x: 0, y: 25 }
                        ]}
                        type="quadratic"
                        closed={true}
                    />
                    <StrokeMaterial color="#16a085" lineWidth={2} lineDash={[5, 5]} />
                </Mesh>
            </Group>

            {/* Mixed combinations Row 5 */}
            <Group position={[100, 580]}>
                {/* Rotated and scaled rectangle */}
                <Mesh position={[40, 0]} rotation={Math.PI / 4} scale={[1.2, 0.8]}>
                    <RectGeometry width={60} height={60} />
                    <BasicMaterial color="#d63031" opacity={0.7} />
                </Mesh>

                {/* Complex star with gradient */}
                <Mesh position={[160, 0]} rotation={Math.PI / 10}>
                    <PolylineGeometry
                        points={Array.from({ length: 10 }, (_, i) => {
                            const angle = (i / 10) * Math.PI * 2
                            const radius = i % 2 === 0 ? 35 : 15
                            return {
                                x: Math.cos(angle) * radius,
                                y: Math.sin(angle) * radius
                            }
                        })}
                        closed={true}
                    />
                    <GradientMaterial gradient={gradient} opacity={0.8} />
                </Mesh>

                {/* Animated heart spline */}
                <Mesh position={[280, 0]} scale={[0.5, 0.5]}>
                    <SplineGeometry
                        points={Array.from({ length: 16 }, (_, i) => {
                            const t = (i / 16) * Math.PI * 2
                            return {
                                x: 16 * Math.pow(Math.sin(t), 3),
                                y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
                            }
                        })}
                        type="smooth"
                        tension={0.4}
                        closed={true}
                    />
                    <BasicMaterial color="#e84393" />
                </Mesh>
            </Group>
        </Scene>
    )
}
