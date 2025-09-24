/** @jsxImportSource sky/jsx */

export default function Foo(): JSX.Node {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ff6600" />
        </mesh>
    )
}
