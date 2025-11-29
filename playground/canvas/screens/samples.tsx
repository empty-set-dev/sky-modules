import '@sky-modules/canvas/jsx/box/Box.implementation'

import { JSX } from 'sky-jsx'

export default function Samples(): JSX.Element {
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600

    return (
        <Box height={screenHeight} backgroundColor="#1e293b" display="flex" flexDirection="column">
            <Box height={60} backgroundColor="#1e293b" padding={15}>
                <Box color="#ffffff" fontSize={20} fontWeight={700}>
                    Canvas Playground
                </Box>
            </Box>

            <Box
                flexGrow={1}
                padding={20}
                display="flex"
                flexDirection="column"
                gap={15}
                overflow="auto"
            >
                <Box
                    height={50}
                    backgroundColor="#3b82f6"
                    color="#ffffff"
                    fontSize={20}
                    padding={15}
                    borderRadius={8}
                >
                    CSS Layout Engine - Flexbox Examples
                </Box>

                <Box
                    backgroundColor="#0f172a"
                    padding={15}
                    borderRadius={8}
                    display="flex"
                    flexDirection="row"
                    gap={10}
                >
                    <Box
                        flexGrow={1}
                        height={90}
                        backgroundColor="#8b5cf6"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        flex-grow: 1
                    </Box>
                    <Box
                        flexGrow={2}
                        height={70}
                        backgroundColor="#ec4899"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        flex-grow: 2
                    </Box>
                    <Box
                        flexGrow={1}
                        height={70}
                        backgroundColor="#10b981"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        flex-grow: 1
                    </Box>
                </Box>

                <Box
                    backgroundColor="#0f172a"
                    padding={15}
                    borderRadius={8}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#f59e0b"
                        color="#000000"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        space-between
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#06b6d4"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        equal spaces
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#84cc16"
                        color="#000000"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        between items
                    </Box>
                </Box>

                <Box
                    backgroundColor="#0f172a"
                    padding={15}
                    borderRadius={8}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                >
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#6366f1"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        space-around
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#a855f7"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        half spaces
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#f43f5e"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        on edges
                    </Box>
                </Box>

                <Box
                    backgroundColor="#0f172a"
                    padding={15}
                    borderRadius={8}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-evenly"
                >
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#14b8a6"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        space-evenly
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#f97316"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        equal spaces
                    </Box>
                    <Box
                        width={150}
                        height={70}
                        backgroundColor="#eab308"
                        color="#000000"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        everywhere
                    </Box>
                </Box>

                <Box
                    backgroundColor="#0f172a"
                    padding={15}
                    borderRadius={8}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    gap={10}
                >
                    <Box
                        width={120}
                        height={70}
                        backgroundColor="#9333ea"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        center
                    </Box>
                    <Box
                        width={120}
                        height={70}
                        backgroundColor="#db2777"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        items
                    </Box>
                    <Box
                        width={120}
                        height={70}
                        backgroundColor="#059669"
                        color="#ffffff"
                        fontSize={12}
                        padding={10}
                        borderRadius={6}
                    >
                        centered
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
