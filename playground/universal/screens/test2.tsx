import { ReactNode } from 'react'

import ScreenLayout from '#/layouts/screen'
import Container from '#/x/universal/layout/Container'

export default function Test2Screen(): ReactNode {
    return (
        <ScreenLayout>
            <Container>Hello, world!</Container>
        </ScreenLayout>
    )
}
