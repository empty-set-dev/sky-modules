import {
    Mesh,
    Scene,
    Group,
    BasicMaterial,
    StrokeMaterial,
    RectGeometry,
    CircleGeometry,
    EllipseGeometry,
    PolylineGeometry,
    SplineGeometry
} from '@sky-modules/Canvas/jsx'
import JSX from 'sky-jsx'

export default function GeometryExamples(): JSX.Element {
    return (
        <Scene background="#ffffff">
            {/* Basic Shapes */}
            <Group position={[50, 50]}>
                <Mesh position={[0, 0]}>
                    <RectGeometry width={80} height={60} />
                    <BasicMaterial color="#ff6b6b" />
                </Mesh>

                <Mesh position={[100, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#4ecdc4" />
                </Mesh>

                <Mesh position={[200, 0]}>
                    <EllipseGeometry radiusX={40} radiusY={25} />
                    <BasicMaterial color="#45b7d1" />
                </Mesh>
            </Group>

            {/* Polyline Examples */}
            <Group position={[50, 150]}>
                {/* Triangle */}
                <Mesh position={[0, 0]}>
                    <PolylineGeometry
                        points={[
                            { x: 0, y: -25 },
                            { x: -22, y: 12 },
                            { x: 22, y: 12 }
                        ]}
                        closed={true}
                    />
                    <BasicMaterial color="#f39c12" />
                </Mesh>

                {/* Pentagon */}
                <Mesh position={[100, 0]}>
                    <PolylineGeometry
                        points={Array.from({ length: 5 }, (_, i) => {
                            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
                            return {
                                x: Math.cos(angle) * 25,
                                y: Math.sin(angle) * 25
                            }
                        })}
                        closed={true}
                    />
                    <StrokeMaterial color="#e74c3c" lineWidth={2} />
                </Mesh>

                {/* Zigzag line */}
                <Mesh position={[200, 0]}>
                    <PolylineGeometry
                        points={[
                            { x: -30, y: 15 },
                            { x: -15, y: -15 },
                            { x: 0, y: 15 },
                            { x: 15, y: -15 },
                            { x: 30, y: 15 }
                        ]}
                        closed={false}
                    />
                    <StrokeMaterial color="#27ae60" lineWidth={3} lineCap="round" />
                </Mesh>
            </Group>

            {/* Spline Examples */}
            <Group position={[50, 250]}>
                {/* Smooth closed curve */}
                <Mesh position={[0, 0]}>
                    <SplineGeometry
                        points={[
                            { x: 0, y: -25 },
                            { x: 25, y: 0 },
                            { x: 0, y: 25 },
                            { x: -25, y: 0 }
                        ]}
                        type="smooth"
                        tension={0.5}
                        closed={true}
                    />
                    <BasicMaterial color="#9b59b6" />
                </Mesh>

                {/* Cubic spline wave */}
                <Mesh position={[100, 0]}>
                    <SplineGeometry
                        points={[
                            { x: -30, y: 0 },
                            { x: -10, y: -20 },
                            { x: 10, y: 20 },
                            { x: 30, y: 0 }
                        ]}
                        type="cubic"
                        tension={0.3}
                        closed={false}
                    />
                    <StrokeMaterial color="#e67e22" lineWidth={2} />
                </Mesh>

                {/* Quadratic spline */}
                <Mesh position={[200, 0]}>
                    <SplineGeometry
                        points={[
                            { x: -20, y: -10 },
                            { x: 0, y: -25 },
                            { x: 20, y: -10 },
                            { x: 20, y: 10 },
                            { x: 0, y: 25 },
                            { x: -20, y: 10 }
                        ]}
                        type="quadratic"
                        closed={true}
                    />
                    <StrokeMaterial color="#16a085" lineWidth={2} lineDash={[5, 3]} />
                </Mesh>
            </Group>
        </Scene>
    )
}