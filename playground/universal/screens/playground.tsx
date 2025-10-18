import { ReactNode } from 'react'

import ScreenLayout from '#/layouts/screen'
import Button from '#/x/universal/buttons/Button'
import AspectRatio from '#/x/universal/layout/AspectRatio'
import Container from '#/x/universal/layout/Container'
import Grid from '#/x/universal/layout/Grid'

const unsplashImage =
    'https://images.unsplash.com/photo-1759434190960-87511b2a5e5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200'

export default function PlaygroundScreen(): ReactNode {
    return (
        <ScreenLayout>
            <Container sx="mt-md">
                <Grid columns="12">
                    <Grid.Item colSpan="6">
                        <AspectRatio aspectRatio={2 / 3} sx="mt-sm" asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item colSpan="6">
                        <AspectRatio aspectRatio={1} sx="mt-sm" asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                    <Grid.Item colSpan="6">
                        <AspectRatio aspectRatio={16 / 9} sx="mt-sm" asChild>
                            <img src={unsplashImage} />
                        </AspectRatio>
                    </Grid.Item>
                </Grid>
                Playground
            </Container>

            <Container sx="mt-md">
                <Button>Button</Button>
            </Container>
        </ScreenLayout>
    )
}
