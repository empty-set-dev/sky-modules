/** @jsxImportSource sky/jsx */

export default function Foo(): JSX.Node {
    return (
        <>
            <gridHelper />
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#ff6600" />
            </mesh>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#ff6600" />
            </mesh>
        </>
    )
}
