import {
    Mesh,
    Scene,
    Group,
    BasicMaterial,
    StrokeMaterial,
    GradientMaterial,
    CircleGeometry,
    RectGeometry
} from '@sky-modules/Canvas/jsx'
import JSX from 'sky-jsx'

export default function MaterialExamples(): JSX.Element {
    // Create gradients for demonstration
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // Linear gradient
    const linearGradient = ctx.createLinearGradient(0, 0, 100, 0)
    linearGradient.addColorStop(0, '#ff0000')
    linearGradient.addColorStop(0.5, '#ffff00')
    linearGradient.addColorStop(1, '#00ff00')

    // Radial gradient
    const radialGradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50)
    radialGradient.addColorStop(0, '#ffffff')
    radialGradient.addColorStop(1, '#000000')

    return (
        <Scene background="#f5f5f5">
            {/* Basic Materials */}
            <Group position={[50, 50]}>
                <Mesh position={[0, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#e74c3c" />
                </Mesh>

                <Mesh position={[80, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#3498db" opacity={0.7} />
                </Mesh>

                <Mesh position={[160, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#2ecc71" opacity={0.5} />
                </Mesh>
            </Group>

            {/* Stroke Materials - Line Styles */}
            <Group position={[50, 150]}>
                <Mesh position={[0, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial color="#8e44ad" lineWidth={2} />
                </Mesh>

                <Mesh position={[80, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial color="#e67e22" lineWidth={4} />
                </Mesh>

                <Mesh position={[160, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial color="#95a5a6" lineWidth={6} />
                </Mesh>
            </Group>

            {/* Stroke Materials - Dash Patterns */}
            <Group position={[50, 250]}>
                <Mesh position={[0, 0]}>
                    <CircleGeometry radius={30} />
                    <StrokeMaterial
                        color="#c0392b"
                        lineWidth={3}
                        lineDash={[10, 5]}
                    />
                </Mesh>

                <Mesh position={[80, 0]}>
                    <CircleGeometry radius={30} />
                    <StrokeMaterial
                        color="#27ae60"
                        lineWidth={3}
                        lineDash={[5, 5, 15, 5]}
                    />
                </Mesh>

                <Mesh position={[160, 0]}>
                    <CircleGeometry radius={30} />
                    <StrokeMaterial
                        color="#2980b9"
                        lineWidth={3}
                        lineDash={[2, 8]}
                        lineDashOffset={4}
                    />
                </Mesh>
            </Group>

            {/* Line Caps and Joins */}
            <Group position={[50, 350]}>
                <Mesh position={[0, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial
                        color="#d35400"
                        lineWidth={8}
                        lineCap="butt"
                        lineJoin="miter"
                    />
                </Mesh>

                <Mesh position={[80, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial
                        color="#8e44ad"
                        lineWidth={8}
                        lineCap="round"
                        lineJoin="round"
                    />
                </Mesh>

                <Mesh position={[160, 0]}>
                    <RectGeometry width={60} height={60} />
                    <StrokeMaterial
                        color="#16a085"
                        lineWidth={8}
                        lineCap="square"
                        lineJoin="bevel"
                    />
                </Mesh>
            </Group>

            {/* Gradient Materials */}
            <Group position={[300, 100]}>
                <Mesh position={[0, 0]}>
                    <RectGeometry width={80} height={60} />
                    <GradientMaterial gradient={linearGradient} />
                </Mesh>

                <Mesh position={[0, 100]}>
                    <CircleGeometry radius={40} />
                    <GradientMaterial gradient={radialGradient} />
                </Mesh>

                <Mesh position={[0, 200]}>
                    <RectGeometry width={80} height={60} />
                    <GradientMaterial gradient={linearGradient} opacity={0.6} />
                </Mesh>
            </Group>

            {/* Opacity Examples */}
            <Group position={[50, 450]}>
                <Mesh position={[0, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#e74c3c" opacity={1.0} />
                </Mesh>

                <Mesh position={[40, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#3498db" opacity={0.8} />
                </Mesh>

                <Mesh position={[80, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#2ecc71" opacity={0.6} />
                </Mesh>

                <Mesh position={[120, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#f39c12" opacity={0.4} />
                </Mesh>

                <Mesh position={[160, 0]}>
                    <CircleGeometry radius={30} />
                    <BasicMaterial color="#9b59b6" opacity={0.2} />
                </Mesh>
            </Group>
        </Scene>
    )
}