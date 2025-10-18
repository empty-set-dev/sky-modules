import { ReactNode } from 'react'

import ScreenLayout from '#/layouts/screen'
import Container from '#/x/universal/layout/Container'

export default function IndexScreen(): ReactNode {
    return (
        <ScreenLayout>
            <Container sx="mt-md">Hello, world!</Container>
        </ScreenLayout>
    )
}
