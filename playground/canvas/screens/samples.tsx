import '@sky-modules/canvas/jsx/box/Box.implementation'

import { JSX } from 'sky-jsx'

export default function Samples(): JSX.Element {
    return (
        <>
            {/* ============================================ */}
            {/* FLEXBOX EXAMPLES */}
            {/* ============================================ */}

            {/* Flex Row - Basic horizontal layout */}
            <Box
                position={[50, 50]}
                width={600}
                height={120}
                backgroundColor="#f0f0f0"
                padding={10}
                display="flex"
                flexDirection="row"
                gap={10}
            >
                <Box width={100} height={100} backgroundColor="#ff6b6b" />
                <Box width={100} height={100} backgroundColor="#4ecdc4" />
                <Box width={100} height={100} backgroundColor="#45b7d1" />
            </Box>

            {/* Flex Column - Vertical layout */}
            <Box
                position={[50, 200]}
                width={150}
                height={400}
                backgroundColor="#f0f0f0"
                padding={10}
                display="flex"
                flexDirection="column"
                gap={15}
            >
                <Box width={130} height={80} backgroundColor="#ff6b6b" />
                <Box width={130} height={80} backgroundColor="#4ecdc4" />
                <Box width={130} height={80} backgroundColor="#45b7d1" />
            </Box>

            {/* Flex with justifyContent - Space Between */}
            <Box
                position={[250, 200]}
                width={500}
                height={100}
                backgroundColor="#2c3e50"
                padding={10}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box width={80} height={80} backgroundColor="#e74c3c" borderRadius={40} />
                <Box width={80} height={80} backgroundColor="#3498db" borderRadius={40} />
                <Box width={80} height={80} backgroundColor="#2ecc71" borderRadius={40} />
            </Box>

            {/* Flex with justifyContent - Center */}
            <Box
                position={[250, 330]}
                width={500}
                height={100}
                backgroundColor="#34495e"
                padding={10}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap={20}
            >
                <Box width={60} height={60} backgroundColor="#9b59b6" />
                <Box width={80} height={80} backgroundColor="#e67e22" />
                <Box width={60} height={60} backgroundColor="#1abc9c" />
            </Box>

            {/* Flex Wrap - Wrapping items */}
            <Box
                position={[250, 460]}
                width={400}
                height={200}
                backgroundColor="#ecf0f1"
                padding={15}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                gap={10}
                alignContent="flex-start"
            >
                <Box width={80} height={80} backgroundColor="#e74c3c" />
                <Box width={80} height={80} backgroundColor="#3498db" />
                <Box width={80} height={80} backgroundColor="#2ecc71" />
                <Box width={80} height={80} backgroundColor="#f39c12" />
                <Box width={80} height={80} backgroundColor="#9b59b6" />
                <Box width={80} height={80} backgroundColor="#1abc9c" />
            </Box>

            {/* ============================================ */}
            {/* GRID EXAMPLES */}
            {/* ============================================ */}

            {/* Grid - 3 columns */}
            <Box
                position={[800, 50]}
                width={450}
                height={320}
                backgroundColor="#f8f9fa"
                padding={15}
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gridGap={15}
            >
                <Box backgroundColor="#ff6b6b" height={90} />
                <Box backgroundColor="#4ecdc4" height={90} />
                <Box backgroundColor="#45b7d1" height={90} />
                <Box backgroundColor="#96ceb4" height={90} />
                <Box backgroundColor="#ffeaa7" height={90} />
                <Box backgroundColor="#dfe6e9" height={90} />
            </Box>

            {/* Grid - 2x3 explicit layout */}
            <Box
                position={[800, 400]}
                width={350}
                height={260}
                backgroundColor="#2d3436"
                padding={10}
                display="grid"
                gridTemplateColumns="150px 150px"
                gridTemplateRows="80px 80px 80px"
                gridGap={10}
            >
                <Box backgroundColor="#fd79a8" />
                <Box backgroundColor="#fdcb6e" />
                <Box backgroundColor="#6c5ce7" />
                <Box backgroundColor="#00b894" />
                <Box backgroundColor="#e17055" />
                <Box backgroundColor="#74b9ff" />
            </Box>

            {/* Grid - Complex layout */}
            <Box
                position={[1300, 50]}
                width={400}
                height={400}
                backgroundColor="#ecf0f1"
                padding={10}
                display="grid"
                gridTemplateColumns="1fr 2fr 1fr"
                gridTemplateRows="100px 150px 100px"
                gridRowGap={10}
                gridColumnGap={10}
            >
                <Box backgroundColor="#e74c3c" />
                <Box backgroundColor="#3498db" />
                <Box backgroundColor="#2ecc71" />
                <Box backgroundColor="#f39c12" />
                <Box backgroundColor="#9b59b6" />
                <Box backgroundColor="#1abc9c" />
                <Box backgroundColor="#e67e22" />
                <Box backgroundColor="#95a5a6" />
                <Box backgroundColor="#34495e" />
            </Box>

            {/* ============================================ */}
            {/* CSS STYLING EXAMPLES */}
            {/* ============================================ */}

            {/* Border & Border Radius */}
            <Box
                position={[50, 700]}
                width={150}
                height={150}
                backgroundColor="#ffffff"
                border="4px solid #e74c3c"
                borderRadius={20}
            />

            <Box
                position={[230, 700]}
                width={150}
                height={150}
                backgroundColor="#3498db"
                borderRadius={75}
            />

            <Box
                position={[410, 700]}
                width={150}
                height={150}
                backgroundColor="#2ecc71"
                borderTopLeftRadius={50}
                borderBottomRightRadius={50}
            />

            {/* Box Shadow & Opacity */}
            <Box
                position={[590, 700]}
                width={150}
                height={150}
                backgroundColor="#9b59b6"
                boxShadow="10px 10px 30px rgba(0, 0, 0, 0.3)"
                borderRadius={10}
            />

            <Box
                position={[770, 700]}
                width={150}
                height={150}
                backgroundColor="#e67e22"
                opacity={0.6}
                borderRadius={15}
            />

            {/* Gradients & Background */}
            <Box
                position={[950, 700]}
                width={150}
                height={150}
                background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius={10}
            />

            <Box
                position={[1130, 700]}
                width={150}
                height={150}
                background="linear-gradient(to right, #f83600 0%, #f9d423 100%)"
                borderRadius={75}
            />

            {/* Complex Border Styles */}
            <Box
                position={[1310, 700]}
                width={150}
                height={150}
                backgroundColor="#ffffff"
                borderWidth={3}
                borderStyle="solid"
                borderColor="#1abc9c"
                borderRadius={10}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            />

            {/* ============================================ */}
            {/* PANDA CSS SHORTHAND EXAMPLES */}
            {/* ============================================ */}

            {/* Using m, p, w, h shorthand props */}
            <Box position={[50, 900]} w={200} h={100} bg="#ff6b6b" m={10} p={20} rounded={15} />

            <Box position={[300, 900]} w={150} h={150} bg="#4ecdc4" mx={20} my={10} rounded={75} />

            {/* Using px, py for padding */}
            <Box
                position={[500, 900]}
                w={250}
                h={120}
                bg="#45b7d1"
                px={30}
                py={20}
                rounded={10}
            />

            {/* Using mt, mr, mb, ml for margin */}
            <Box position={[800, 900]} w={180} h={180} bg="#96ceb4" mt={10} ml={20} rounded={20} />

            {/* ============================================ */}
            {/* FONT-FAMILY & TYPOGRAPHY EXAMPLES */}
            {/* ============================================ */}

            {/* System Fonts */}
            <Box
                position={[50, 1100]}
                width={300}
                height={80}
                backgroundColor="#2c3e50"
                color="#ecf0f1"
                fontSize="24px"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="700"
                padding={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                System Font Bold
            </Box>

            {/* Serif Font */}
            <Box
                position={[380, 1100]}
                width={300}
                height={80}
                backgroundColor="#8e44ad"
                color="#ffffff"
                fontSize="28px"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                padding={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                Georgia Italic
            </Box>

            {/* Monospace Font */}
            <Box
                position={[710, 1100]}
                width={350}
                height={80}
                backgroundColor="#16a085"
                color="#ffffff"
                fontSize="20px"
                fontFamily="'Courier New', monospace"
                fontWeight="600"
                padding={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                Monospace Code Style
            </Box>

            {/* Comic Sans (for variety) */}
            <Box
                position={[1090, 1100]}
                width={300}
                height={80}
                backgroundColor="#e74c3c"
                color="#ffffff"
                fontSize="22px"
                fontFamily="'Comic Sans MS', cursive"
                fontWeight="400"
                padding={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                Playful Font Style
            </Box>

            {/* Different Font Weights */}
            <Box
                position={[50, 1210]}
                width={250}
                height={70}
                backgroundColor="#3498db"
                color="#ffffff"
                fontSize="20px"
                fontFamily="Arial, sans-serif"
                fontWeight="300"
                padding={15}
            >
                Light Weight (300)
            </Box>

            <Box
                position={[330, 1210]}
                width={250}
                height={70}
                backgroundColor="#3498db"
                color="#ffffff"
                fontSize="20px"
                fontFamily="Arial, sans-serif"
                fontWeight="400"
                padding={15}
            >
                Normal Weight (400)
            </Box>

            <Box
                position={[610, 1210]}
                width={250}
                height={70}
                backgroundColor="#3498db"
                color="#ffffff"
                fontSize="20px"
                fontFamily="Arial, sans-serif"
                fontWeight="700"
                padding={15}
            >
                Bold Weight (700)
            </Box>

            <Box
                position={[890, 1210]}
                width={250}
                height={70}
                backgroundColor="#3498db"
                color="#ffffff"
                fontSize="20px"
                fontFamily="Arial, sans-serif"
                fontWeight="900"
                padding={15}
            >
                Black Weight (900)
            </Box>

            {/* Text Alignment */}
            <Box
                position={[50, 1310]}
                width={350}
                height={60}
                backgroundColor="#95a5a6"
                color="#2c3e50"
                fontSize="18px"
                fontFamily="Verdana, sans-serif"
                textAlign="left"
                padding={15}
            >
                Left Aligned Text
            </Box>

            <Box
                position={[430, 1310]}
                width={350}
                height={60}
                backgroundColor="#95a5a6"
                color="#2c3e50"
                fontSize="18px"
                fontFamily="Verdana, sans-serif"
                textAlign="center"
                padding={15}
            >
                Center Aligned Text
            </Box>

            <Box
                position={[810, 1310]}
                width={350}
                height={60}
                backgroundColor="#95a5a6"
                color="#2c3e50"
                fontSize="18px"
                fontFamily="Verdana, sans-serif"
                textAlign="right"
                padding={15}
            >
                Right Aligned Text
            </Box>

            {/* ============================================ */}
            {/* COMBINED COMPLEX EXAMPLES */}
            {/* ============================================ */}

            {/* Card-like component with flex layout */}
            <Box
                position={[50, 1420]}
                width={400}
                height={250}
                backgroundColor="#ffffff"
                borderRadius={20}
                boxShadow="0 10px 40px rgba(0, 0, 0, 0.15)"
                padding={30}
                display="flex"
                flexDirection="column"
                gap={15}
            >
                <Box
                    width={340}
                    height={60}
                    backgroundColor="#667eea"
                    borderRadius={10}
                    color="#ffffff"
                    fontSize="24px"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="700"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    Card Header
                </Box>

                <Box
                    display="flex"
                    flexDirection="row"
                    gap={10}
                    justifyContent="space-between"
                    width={340}
                    height={120}
                >
                    <Box
                        width={105}
                        height={120}
                        backgroundColor="#f093fb"
                        borderRadius={10}
                        opacity={0.8}
                    />
                    <Box
                        width={105}
                        height={120}
                        backgroundColor="#4facfe"
                        borderRadius={10}
                        opacity={0.8}
                    />
                    <Box
                        width={105}
                        height={120}
                        backgroundColor="#43e97b"
                        borderRadius={10}
                        opacity={0.8}
                    />
                </Box>
            </Box>

            {/* Dashboard-style grid layout */}
            <Box
                position={[480, 1420]}
                width={500}
                height={350}
                backgroundColor="#f5f7fa"
                borderRadius={15}
                padding={20}
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gridTemplateRows="140px 140px"
                gridGap={15}
            >
                <Box
                    backgroundColor="#fa709a"
                    borderRadius={12}
                    boxShadow="0 4px 15px rgba(250, 112, 154, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="20px"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    color="#ffffff"
                >
                    Metric 1
                </Box>
                <Box
                    backgroundColor="#fee140"
                    borderRadius={12}
                    boxShadow="0 4px 15px rgba(254, 225, 64, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="20px"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    color="#2c3e50"
                >
                    Metric 2
                </Box>
                <Box
                    backgroundColor="#30cfd0"
                    borderRadius={12}
                    boxShadow="0 4px 15px rgba(48, 207, 208, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="20px"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    color="#ffffff"
                >
                    Metric 3
                </Box>
                <Box
                    backgroundColor="#a8edea"
                    borderRadius={12}
                    boxShadow="0 4px 15px rgba(168, 237, 234, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="20px"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    color="#2c3e50"
                >
                    Metric 4
                </Box>
            </Box>

            {/* Nested flex layout with typography */}
            <Box
                position={[1010, 1420]}
                width={450}
                height={350}
                backgroundColor="#1e272e"
                borderRadius={20}
                padding={25}
                display="flex"
                flexDirection="column"
                gap={20}
            >
                <Box
                    width={400}
                    height={80}
                    backgroundColor="transparent"
                    color="#ffffff"
                    fontSize="32px"
                    fontFamily="Georgia, serif"
                    fontWeight="700"
                    display="flex"
                    alignItems="center"
                >
                    Typography Showcase
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    gap={12}
                    width={400}
                    height={200}
                >
                    <Box
                        height={40}
                        backgroundColor="#ff6348"
                        borderRadius={8}
                        color="#ffffff"
                        fontSize="16px"
                        fontFamily="'Courier New', monospace"
                        padding={10}
                    >
                        Monospace Font Example
                    </Box>
                    <Box
                        height={40}
                        backgroundColor="#ffa502"
                        borderRadius={8}
                        color="#2c3e50"
                        fontSize="18px"
                        fontFamily="Arial, sans-serif"
                        fontWeight="600"
                        padding={10}
                    >
                        Sans-serif Bold Text
                    </Box>
                    <Box
                        height={40}
                        backgroundColor="#2ed573"
                        borderRadius={8}
                        color="#ffffff"
                        fontSize="17px"
                        fontFamily="Georgia, serif"
                        fontStyle="italic"
                        padding={10}
                    >
                        Serif Italic Typography
                    </Box>
                    <Box
                        height={40}
                        backgroundColor="#1e90ff"
                        borderRadius={8}
                        color="#ffffff"
                        fontSize="15px"
                        fontFamily="system-ui, sans-serif"
                        fontWeight="300"
                        padding={10}
                    >
                        System UI Light Weight
                    </Box>
                </Box>
            </Box>

            {/* Colorful gradient showcase */}
            <Box
                position={[1500, 1420]}
                width={300}
                height={350}
                backgroundColor="#f8f9fa"
                borderRadius={15}
                padding={15}
                display="flex"
                flexDirection="column"
                gap={10}
            >
                <Box
                    height={60}
                    background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    borderRadius={10}
                />
                <Box
                    height={60}
                    background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    borderRadius={10}
                />
                <Box
                    height={60}
                    background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    borderRadius={10}
                />
                <Box
                    height={60}
                    background="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    borderRadius={10}
                />
                <Box
                    height={60}
                    background="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                    borderRadius={10}
                />
            </Box>
        </>
    )
}
