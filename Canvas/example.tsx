/* eslint-disable @typescript-eslint/no-explicit-any */

import JSX from 'sky-jsx'

// Функция анимации вращающегося квадрата
function RotatingSquare(): JSX.Element {
    return (
        <mesh
            position={[400, 300]} // центр canvas
            onUpdate={(mesh, time) => {
                // Анимация вращения
                mesh.rotation = time * 2

                // Анимация масштаба (пульсация)
                const scale = 1 + Math.sin(time * 3) * 0.3
                mesh.scale.set(scale, scale)
            }}
        >
            <rectGeometry width={100} height={100} x={-50} y={-50} />
            <basicMaterial color="#ff6b6b" />
        </mesh>
    )
}

// Функция анимации движущегося круга
function MovingCircle(): JSX.Element {
    return (
        <mesh
            onUpdate={(mesh, time) => {
                // Движение по кругу
                const radius = 150
                const x = 400 + Math.cos(time) * radius
                const y = 300 + Math.sin(time) * radius
                mesh.position.set(x, y)

                // Изменение цвета через материал
                const hue = (time * 50) % 360
                ;(mesh.material as any).color = `hsl(${hue}, 70%, 60%)`
            }}
        >
            <circleGeometry radius={30} />
            <basicMaterial color="#4ecdc4" />
        </mesh>
    )
}

// Функция анимации группы объектов
function AnimatedGroup(): JSX.Element {
    return (
        <group
            position={[200, 150]}
            onUpdate={(group, time) => {
                // Вращение всей группы
                group.rotation = time * 0.5
            }}
        >
            {/* Несколько маленьких кругов */}
            <mesh position={[0, 0]}>
                <circleGeometry radius={20} />
                <basicMaterial color="#45b7d1" />
            </mesh>

            <mesh position={[60, 0]}>
                <circleGeometry radius={15} />
                <basicMaterial color="#96ceb4" />
            </mesh>

            <mesh position={[30, 52]}>
                <circleGeometry radius={18} />
                <basicMaterial color="#ffeaa7" />
            </mesh>
        </group>
    )
}

// Функция создания эллипса с анимацией
function PulsingEllipse(): JSX.Element {
    return (
        <mesh
            position={[600, 450]}
            onUpdate={(mesh, time) => {
                // Пульсация размера
                const scaleX = 1 + Math.sin(time * 4) * 0.5
                const scaleY = 1 + Math.cos(time * 3) * 0.3
                mesh.scale.set(scaleX, scaleY)

                // Вращение
                mesh.rotation = time * 1.5
            }}
        >
            <ellipseGeometry radiusX={40} radiusY={25} />
            <strokeMaterial color="#e17055" lineWidth={3} />
        </mesh>
    )
}

// Главная сцена с анимацией
function AnimatedScene(): JSX.Element {
    return (
        <scene background="#2d3436">
            <RotatingSquare />
            <MovingCircle />
            <AnimatedGroup />
            <PulsingEllipse />

            {/* Статичные элементы для контраста */}
            <mesh position={[100, 500]}>
                <rectGeometry width={80} height={40} x={-40} y={-20} />
                <basicMaterial color="#74b9ff" />
            </mesh>

            <mesh position={[700, 100]}>
                <circleGeometry radius={25} />
                <strokeMaterial color="#fd79a8" lineWidth={2} />
            </mesh>
        </scene>
    )
}

export function InteractiveExample(): JSX.Node {
    let mouseX = 0
    let mouseY = 0

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX
        mouseY = e.clientY
    })

    return (
        <scene background="#121212">
            {/* Объект, следующий за мышью */}
            <mesh
                onUpdate={mesh => {
                    // Плавное движение к позиции мыши
                    const targetX = mouseX
                    const targetY = mouseY
                    const currentX = mesh.position.x
                    const currentY = mesh.position.y

                    mesh.position.set(
                        currentX + (targetX - currentX) * 0.1,
                        currentY + (targetY - currentY) * 0.1
                    )
                }}
            >
                <circleGeometry radius={20} />
                <basicMaterial color="#00cec9" />
            </mesh>

            {/* Следы за мышью */}
            <group
                onUpdate={(group, time) => {
                    // Плавное движение к позиции мыши
                    const targetX = mouseX
                    const targetY = mouseY
                    const currentX = group.position.x
                    const currentY = group.position.y
                    group.position.set(
                        currentX + (targetX - currentX) * 0.1,
                        currentY + (targetY - currentY) * 0.1
                    )
                }}
            >
                <mesh position={[mouseX - 50, mouseY]}>
                    <circleGeometry radius={5} />
                    <basicMaterial color="#fd79a8" opacity={0.5} />
                </mesh>

                <mesh position={[mouseX - 100, mouseY]}>
                    <circleGeometry radius={3} />
                    <basicMaterial color="#fd79a8" opacity={0.3} />
                </mesh>
            </group>
        </scene>
    )
}
