import '#/imports'
import '../../.dev/styled-system/styles.css'

import { recipe } from '@sky-modules/design/recipe'
import { ReactNode, useState } from 'react'

import { SXProvider } from './mitosis/design/SX'
// import Container from './mitosis/universal/Container'
import Button from './mitosis/universal/Button'
import Flex from './mitosis/universal/Flex'
import { LayoutRoot } from './mitosis/universal/Layout'
import Popover, { usePopover } from './mitosis/universal/Popover'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        const [theme] = useState<'light' | 'dark'>('light')
        const [palette] = useState('pink')

        const popover = usePopover({
            placement: 'top',
            withArrow: true,
            offsetValue: 0,
        })

        return (
            <SXProvider
                brand="universal-example-brand"
                initialTheme={theme}
                initialPalette={palette}
            >
                <LayoutRoot variant="landing" fullHeight="viewport">
                    <PlatformVariables />

                    <Flex w="20" h="20" bg="red.500">
                        Hello, grid!
                    </Flex>
                    <Flex w="20" h="20" sx="bg-red-500">
                        Hello, grid!
                    </Flex>

                    <Popover popover={popover} trigger={<Button>Color Picker</Button>}>
                        Color Picker
                    </Popover>
                </LayoutRoot>
            </SXProvider>
        )
    }
}

function PlatformVariables(): ReactNode {
    return (
        <Box p="4" sx={platformVariablesRecipe()} className="bg-red-500">
            <Box>ARCH: {ARCH}</Box>
            <Box>PLATFORM: {PLATFORM}</Box>
            <Box>OS: {OS}</Box>
            <Box>APP_PLATFORM_TARGET: {APP_PLATFORM_TARGET}</Box>
        </Box>
    )
}

const platformVariablesRecipe = recipe({
    base: `
        bg-red-500
    `,
})
