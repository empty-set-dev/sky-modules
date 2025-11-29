import '@sky-modules/canvas/jsx/box/Box.implementation'

import { JSX } from 'sky-jsx'

export default function Test(): JSX.Element {
    return (
        <Box width={800} height={600} backgroundColor="#1e293b">
            {/* Corner markers to show background boundaries */}
            <Box width={10} height={10} backgroundColor="#ff00ff" position={[0, 0]} />
            <Box width={10} height={10} backgroundColor="#ff00ff" position={[790, 0]} />
            <Box width={10} height={10} backgroundColor="#ff00ff" position={[0, 590]} />
            <Box width={10} height={10} backgroundColor="#ff00ff" position={[790, 590]} />

            <Box
                width={100}
                height={100}
                backgroundColor="#ff0000"
                position={[50, 50]}
                border="4px solid #ffffff"
            >
                Red Box
            </Box>
            <Box
                width={100}
                height={100}
                backgroundColor="#00ff00"
                position={[200, 50]}
                borderWidth={2}
                borderColor="#ffff00"
                borderStyle="dashed"
            >
                Green Box
            </Box>
            <Box
                width={100}
                height={100}
                backgroundColor="#0000ff"
                position={[350, 50]}
                borderWidth={3}
                borderColor="#ff00ff"
                borderRadius={10}
            >
                Blue Box
            </Box>
        </Box>
    )
}
