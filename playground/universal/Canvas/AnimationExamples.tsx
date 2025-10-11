import {
    Mesh,
    Scene,
    Group,
    BasicMaterial,
    StrokeMaterial,
    CircleGeometry,
    RectGeometry,
    PolylineGeometry,
    SplineGeometry
} from '@sky-modules/Canvas/jsx'
import JSX from 'sky-jsx'

export default function AnimationExamples(): JSX.Element {
    return (
        <Scene background="#1a1a1a">
            {/* Rotating Squares */}
            <Group position={[100, 100]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.rotation = time * 0.5
                        mesh.scale.set(1 + Math.sin(time * 2) * 0.2, 1 + Math.sin(time * 2) * 0.2)
                    }}
                >
                    <RectGeometry width={60} height={60} />
                    <BasicMaterial color="#e74c3c" />
                </Mesh>

                <Mesh
                    position={[100, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.rotation = -time * 0.8
                        mesh.position.y = Math.sin(time * 3) * 20
                    }}
                >
                    <RectGeometry width={40} height={40} />
                    <StrokeMaterial color="#3498db" lineWidth={3} />
                </Mesh>
            </Group>

            {/* Orbiting Circles */}
            <Group position={[300, 100]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.position.x = Math.cos(time) * 50
                        mesh.position.y = Math.sin(time) * 30
                    }}
                >
                    <CircleGeometry radius={15} />
                    <BasicMaterial color="#2ecc71" />
                </Mesh>

                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.position.x = Math.cos(time * 1.5 + Math.PI) * 30
                        mesh.position.y = Math.sin(time * 1.5 + Math.PI) * 50
                    }}
                >
                    <CircleGeometry radius={12} />
                    <BasicMaterial color="#f39c12" />
                </Mesh>

                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.position.x = Math.cos(time * 2) * 40
                        mesh.position.y = Math.sin(time * 2) * 40
                    }}
                >
                    <CircleGeometry radius={8} />
                    <BasicMaterial color="#9b59b6" />
                </Mesh>
            </Group>

            {/* Morphing Star */}
            <Group position={[100, 300]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        const points = Array.from({ length: 10 }, (_, i) => {
                            const angle = (i / 10) * Math.PI * 2
                            const baseRadius = i % 2 === 0 ? 40 : 20
                            const radius = baseRadius + Math.sin(time * 4 + i) * 10
                            return {
                                x: Math.cos(angle) * radius,
                                y: Math.sin(angle) * radius
                            }
                        })

                        // Update geometry points (this is a conceptual example)
                        // In real implementation, you'd need to recreate the geometry
                        mesh.rotation = time * 0.3
                    }}
                >
                    <PolylineGeometry
                        points={Array.from({ length: 10 }, (_, i) => {
                            const angle = (i / 10) * Math.PI * 2
                            const radius = i % 2 === 0 ? 40 : 20
                            return {
                                x: Math.cos(angle) * radius,
                                y: Math.sin(angle) * radius
                            }
                        })}
                        closed={true}
                    />
                    <StrokeMaterial color="#e67e22" lineWidth={2} />
                </Mesh>
            </Group>

            {/* Pulsating Heart */}
            <Group position={[300, 300]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        const scale = 0.8 + Math.sin(time * 6) * 0.3
                        mesh.scale.set(scale, scale)

                        // Color interpolation effect
                        const intensity = (Math.sin(time * 6) + 1) / 2
                        // This would require dynamic material updates in a real implementation
                    }}
                >
                    <SplineGeometry
                        points={Array.from({ length: 16 }, (_, i) => {
                            const t = (i / 16) * Math.PI * 2
                            return {
                                x: 16 * Math.pow(Math.sin(t), 3) * 2,
                                y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2
                            }
                        })}
                        type="smooth"
                        tension={0.4}
                        closed={true}
                    />
                    <BasicMaterial color="#e84393" />
                </Mesh>
            </Group>

            {/* Wave Motion */}
            <Group position={[500, 200]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        mesh.position.y = Math.sin(time * 2) * 50
                        mesh.rotation = Math.sin(time) * 0.2
                    }}
                >
                    <SplineGeometry
                        points={[
                            { x: -60, y: 0 },
                            { x: -20, y: -30 },
                            { x: 20, y: 30 },
                            { x: 60, y: 0 }
                        ]}
                        type="smooth"
                        tension={0.4}
                        closed={false}
                    />
                    <StrokeMaterial color="#1abc9c" lineWidth={4} lineCap="round" />
                </Mesh>
            </Group>

            {/* Group Rotation */}
            <Group
                position={[150, 450]}
                onUpdate={(group, time) => {
                    group.rotation = time * 0.2
                }}
            >
                <Mesh position={[0, -40]}>
                    <CircleGeometry radius={10} />
                    <BasicMaterial color="#e74c3c" />
                </Mesh>

                <Mesh position={[40, 0]}>
                    <CircleGeometry radius={10} />
                    <BasicMaterial color="#3498db" />
                </Mesh>

                <Mesh position={[0, 40]}>
                    <CircleGeometry radius={10} />
                    <BasicMaterial color="#2ecc71" />
                </Mesh>

                <Mesh position={[-40, 0]}>
                    <CircleGeometry radius={10} />
                    <BasicMaterial color="#f39c12" />
                </Mesh>
            </Group>

            {/* Opacity Animation */}
            <Group position={[350, 450]}>
                <Mesh
                    position={[0, 0]}
                    onUpdate={(mesh, time) => {
                        // Opacity pulsing - this would require dynamic material updates
                        mesh.scale.set(
                            1 + Math.sin(time * 4) * 0.3,
                            1 + Math.sin(time * 4) * 0.3
                        )
                    }}
                >
                    <RectGeometry width={50} height={50} />
                    <BasicMaterial color="#9b59b6" opacity={0.8} />
                </Mesh>
            </Group>
        </Scene>
    )
}