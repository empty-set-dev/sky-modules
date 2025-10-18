import '#setup'
import { ReactNode } from 'react'

import ScreenLayout from '#/layouts/screen'
import Button from '#/x/universal/buttons/Button'
import AspectRatio from '#/x/universal/layout/AspectRatio'
import Container from '#/x/universal/layout/Container'
import Grid from '#/x/universal/layout/Grid'
import Text from '#/x/universal/typegraphy/Text'

const unsplashImage =
    'https://images.unsplash.com/photo-1759434190960-87511b2a5e5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200'

export default function PlaygroundScreen(): ReactNode {
    return (
        <ScreenLayout>
            <Container mt="md">Playground</Container>

            <Box sx="bg-neutral-300"></Box>

            <Container mt="md">
                <Grid columns="auto">
                    <Grid.Item>
                        <Text mt="md" size="sm">
                            2 / 3
                        </Text>
                        <AspectRatio aspectRatio={2 / 3} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item>
                        <AspectRatio aspectRatio={1} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item>
                        <AspectRatio aspectRatio={16 / 9} asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                </Grid>
            </Container>

            <Container mt="md">
                <Button>Button</Button>
            </Container>
        </ScreenLayout>
    )
}
