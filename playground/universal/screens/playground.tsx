import '#setup'
import { ReactNode } from 'react'

import ScreenLayout from '#/layouts/screen'
import Button from '#/x/universal/buttons/Button'
import AspectRatio from '#/x/universal/layout/AspectRatio'
import Container from '#/x/universal/layout/Container'
import Grid from '#/x/universal/layout/Grid'
import Heading from '#/x/universal/typegraphy/Heading'
import Text from '#/x/universal/typegraphy/Text'

const unsplashImage =
    'https://images.unsplash.com/photo-1759434190960-87511b2a5e5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200'

export default function PlaygroundScreen(): ReactNode {
    return (
        <ScreenLayout mb="xl">
            {/* Aspect Ratio */}
            <Container mt="2xl">
                <Heading as="h2" size="2xl">
                    Aspect Ratio
                </Heading>
                <Grid mt="lg" columns="auto">
                    <Grid.Item>
                        <Text size="sm" sx="text-secondary">
                            2 / 3
                        </Text>
                        <AspectRatio mt="sm" aspectRatio={2 / 3} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item>
                        <Text size="sm" sx="text-secondary">
                            1 / 1
                        </Text>
                        <AspectRatio mt="sm" aspectRatio={1} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item>
                        <Text size="sm" sx="text-secondary">
                            16 / 9
                        </Text>
                        <AspectRatio mt="sm" aspectRatio={16 / 9} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                </Grid>
            </Container>

            {/* Buttons */}
            <Container mt="md">
                <Heading as="h2" size="2xl">
                    Buttons
                </Heading>
                <Button mt="lg">Button</Button>
            </Container>

            {/* Heading */}
            <Container mt="xl">
                <Heading as="h2" size="2xl">
                    Heading
                </Heading>
                <Heading mt="lg" size="xs" as="h6">
                    Extra Small Heading (xs)
                </Heading>
                <Heading size="sm" as="h5" mt="sm">
                    Small Heading (sm)
                </Heading>
                <Heading size="md" as="h4" mt="sm">
                    Medium Heading (md)
                </Heading>
                <Heading size="lg" as="h3" mt="sm">
                    Large Heading (lg)
                </Heading>
                <Heading size="xl" as="h2" mt="sm">
                    Extra Large Heading (xl)
                </Heading>
                <Heading size="2xl" as="h1" mt="sm">
                    2XL Heading (2xl)
                </Heading>
                <Heading size="3xl" mt="sm">
                    3XL Heading (3xl)
                </Heading>
                <Heading size="4xl" mt="sm">
                    4XL Heading (4xl)
                </Heading>
            </Container>
        </ScreenLayout>
    )
}
