import '#/imports'
import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import { ReactNode, useState } from 'react'

import { SXProvider } from './mitosis/design/SX'
import Button from './mitosis/universal/Button'
import Col from './mitosis/universal/Col'
import Container from './mitosis/universal/Container'
import Flex from './mitosis/universal/Flex'
import Grid from './mitosis/universal/Grid'
import HStack from './mitosis/universal/HStack'
import Layout, { LayoutRoot, LayoutHeader } from './mitosis/universal/Layout'
import Link from './mitosis/universal/Link'
import Row from './mitosis/universal/Row'
import VStack from './mitosis/universal/VStack'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        const [theme, setTheme] = useState<'light' | 'dark'>('light')
        const [palette, setPalette] = useState('pink')

        return (
            <SXProvider
                brand="universal-example-brand"
                initialTheme={theme}
                initialPalette={palette}
            >
                <LayoutRoot variant="landing" fullHeight="viewport">
                    <LayoutHeader variant="navbar" sticky background="blur">
                        <Container size="7xl">
                            <HStack justify="between" align="center">
                                <HStack align="center" gap="lg">
                                    <Box sx="text-2xl font-bold text-(--brand-primary)">
                                        🌟 Sky Modules
                                    </Box>
                                    <HStack gap="md">
                                        <Link href="#components">Components</Link>
                                        <Link href="#layout">Layout</Link>
                                        <Link href="#examples">Examples</Link>
                                    </HStack>
                                </HStack>
                                <HStack gap="sm">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setTheme(theme === 'light' ? 'dark' : 'light')
                                        }
                                    >
                                        {theme === 'light' ? '🌙' : '☀️'}
                                    </Button>
                                    <Button variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </HStack>
                            </HStack>
                        </Container>
                    </LayoutHeader>

                    <Layout showHeader={false}>
                        {/* Hero Section */}
                        <VStack
                            gap="2xl"
                            align="center"
                            sx="py-(--spacing-4xl) bg-gradient-to-b from-(--brand-50) to-(--surface-primary)"
                        >
                            <Container size="4xl" center>
                                <VStack gap="xl" align="center">
                                    <VStack gap="md" align="center">
                                        <Box sx="text-6xl font-bold text-center bg-gradient-to-r from-(--brand-primary) to-(--brand-secondary) bg-clip-text text-transparent">
                                            Universal Design System
                                        </Box>
                                        <Box sx="text-xl text-(--content-secondary) text-center max-w-2xl">
                                            Создавай потрясающие интерфейсы с нашей универсальной
                                            системой компонентов. От простых кнопок до сложных
                                            layout'ов — всё в одном месте!
                                        </Box>
                                    </VStack>
                                    <HStack gap="md" wrap>
                                        <Button variant="primary" size="lg">
                                            🚀 Начать разработку
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            📖 Документация
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Container>
                        </VStack>

                        {/* Components Showcase */}
                        <Box id="components" sx="py-(--spacing-4xl)">
                            <Container size="6xl" center>
                                <VStack gap="3xl">
                                    <VStack gap="lg" align="center">
                                        <Box sx="text-4xl font-bold text-center">🎨 Компоненты</Box>
                                        <Box sx="text-lg text-(--content-secondary) text-center">
                                            Полная коллекция готовых к использованию компонентов
                                        </Box>
                                    </VStack>

                                    {/* Buttons Section */}
                                    <VStack gap="xl">
                                        <Box sx="text-2xl font-semibold">Buttons</Box>
                                        <VStack gap="lg">
                                            <HStack gap="md" wrap>
                                                <Button variant="primary">Primary</Button>
                                                <Button variant="secondary">Secondary</Button>
                                                <Button variant="outline">Outline</Button>
                                                <Button variant="ghost">Ghost</Button>
                                                <Button variant="danger">Danger</Button>
                                            </HStack>
                                            <HStack gap="md" wrap>
                                                <Button size="sm">Small</Button>
                                                <Button size="md">Medium</Button>
                                                <Button size="lg">Large</Button>
                                                <Button loading>Loading</Button>
                                                <Button disabled>Disabled</Button>
                                            </HStack>
                                        </VStack>
                                    </VStack>

                                    {/* Links Section */}
                                    <VStack gap="lg">
                                        <Box sx="text-2xl font-semibold">Links</Box>
                                        <HStack gap="lg" wrap>
                                            <Link>Default Link</Link>
                                            <Link underline>Underlined</Link>
                                            <Link subtle>Subtle</Link>
                                            <Link underline subtle>
                                                Subtle Underlined
                                            </Link>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </Container>
                        </Box>

                        {/* Layout Showcase */}
                        <Box id="layout" sx="py-(--spacing-4xl) bg-(--surface-secondary)">
                            <Container size="6xl" center>
                                <VStack gap="3xl">
                                    <VStack gap="lg" align="center">
                                        <Box sx="text-4xl font-bold text-center">
                                            📐 Layout System
                                        </Box>
                                        <Box sx="text-lg text-(--content-secondary) text-center">
                                            Мощная система компоновки для любых макетов
                                        </Box>
                                    </VStack>

                                    {/* Stacks Demo */}
                                    <VStack gap="xl">
                                        <Box sx="text-2xl font-semibold">Stacks & Flex</Box>
                                        <Grid columns={3} gap="lg">
                                            <VStack
                                                gap="md"
                                                sx="p-(--spacing-lg) bg-(--surface-primary) rounded-(--radius-lg)"
                                            >
                                                <Box sx="font-semibold">VStack</Box>
                                                <VStack gap="sm">
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-100) rounded text-center">
                                                        Item 1
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-200) rounded text-center">
                                                        Item 2
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-300) rounded text-center">
                                                        Item 3
                                                    </Box>
                                                </VStack>
                                            </VStack>

                                            <VStack
                                                gap="md"
                                                sx="p-(--spacing-lg) bg-(--surface-primary) rounded-(--radius-lg)"
                                            >
                                                <Box sx="font-semibold">HStack</Box>
                                                <HStack gap="sm">
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-100) rounded text-center flex-1">
                                                        A
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-200) rounded text-center flex-1">
                                                        B
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-300) rounded text-center flex-1">
                                                        C
                                                    </Box>
                                                </HStack>
                                            </VStack>

                                            <VStack
                                                gap="md"
                                                sx="p-(--spacing-lg) bg-(--surface-primary) rounded-(--radius-lg)"
                                            >
                                                <Box sx="font-semibold">Flex</Box>
                                                <Flex direction="column" gap="sm" align="center">
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-100) rounded">
                                                        🎯
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-200) rounded">
                                                        🚀
                                                    </Box>
                                                    <Box sx="p-(--spacing-sm) bg-(--brand-300) rounded">
                                                        ✨
                                                    </Box>
                                                </Flex>
                                            </VStack>
                                        </Grid>
                                    </VStack>

                                    {/* Grid Demo */}
                                    <VStack gap="lg">
                                        <Box sx="text-2xl font-semibold">Grid System</Box>
                                        <VStack gap="md">
                                            <Row gutter="md">
                                                <Col
                                                    span={12}
                                                    sx="p-(--spacing-md) bg-(--brand-100) rounded text-center"
                                                >
                                                    12 columns
                                                </Col>
                                            </Row>
                                            <Row gutter="md">
                                                <Col
                                                    span={6}
                                                    sx="p-(--spacing-md) bg-(--brand-200) rounded text-center"
                                                >
                                                    6 columns
                                                </Col>
                                                <Col
                                                    span={6}
                                                    sx="p-(--spacing-md) bg-(--brand-300) rounded text-center"
                                                >
                                                    6 columns
                                                </Col>
                                            </Row>
                                            <Row gutter="md">
                                                <Col
                                                    span={4}
                                                    sx="p-(--spacing-md) bg-(--brand-400) rounded text-center text-white"
                                                >
                                                    4 col
                                                </Col>
                                                <Col
                                                    span={4}
                                                    sx="p-(--spacing-md) bg-(--brand-500) rounded text-center text-white"
                                                >
                                                    4 col
                                                </Col>
                                                <Col
                                                    span={4}
                                                    sx="p-(--spacing-md) bg-(--brand-600) rounded text-center text-white"
                                                >
                                                    4 col
                                                </Col>
                                            </Row>
                                        </VStack>
                                    </VStack>
                                </VStack>
                            </Container>
                        </Box>

                        {/* Examples Section */}
                        <Box id="examples" sx="py-(--spacing-4xl)">
                            <Container size="6xl" center>
                                <VStack gap="3xl">
                                    <VStack gap="lg" align="center">
                                        <Box sx="text-4xl font-bold text-center">
                                            🌟 Примеры использования
                                        </Box>
                                        <Box sx="text-lg text-(--content-secondary) text-center">
                                            Реальные примеры компоновки интерфейсов
                                        </Box>
                                    </VStack>

                                    {/* Product Cards с дизайном как на скриншоте */}
                                    <VStack gap="lg">
                                        <VStack gap="md" align="center">
                                            <Box sx="text-4xl font-bold text-white flex items-center gap-3">
                                                <span>🌟</span>
                                                Примеры использования
                                            </Box>
                                            <Box sx="text-lg text-gray-300">
                                                Реальные примеры компоновки интерфейсов
                                            </Box>
                                        </VStack>

                                        <Box sx="bg-black p-12 rounded-xl">
                                            <Grid columns={3} gap="lg">
                                                {[1, 2, 3].map(i => (
                                                    <VStack
                                                        key={i}
                                                        gap="none"
                                                        sx="bg-black/80 rounded-lg overflow-hidden border border-white/10 hover:transform hover:translate-y-[-4px] transition-all duration-200 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
                                                    >
                                                        {/* Gradient Image Placeholder */}
                                                        <Box sx="h-48 bg-gradient-to-br from-teal-400 to-teal-500 relative overflow-hidden group">
                                                            <Box sx="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-500 transition-transform group-hover:scale-105 duration-300"></Box>
                                                        </Box>

                                                        {/* Content */}
                                                        <VStack gap="sm" sx="p-4">
                                                            <Box sx="text-lg font-semibold text-white">
                                                                Product {i}
                                                            </Box>
                                                            <Box sx="text-gray-300 text-sm leading-relaxed">
                                                                Amazing product description that showcases our components
                                                            </Box>
                                                            <Box sx="text-2xl font-bold text-pink-400 mb-2">
                                                                $99
                                                            </Box>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                sx="bg-pink-500 hover:bg-pink-600 text-white font-medium w-full"
                                                            >
                                                                Buy Now ❤️
                                                            </Button>
                                                        </VStack>
                                                    </VStack>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </VStack>

                                    {/* Dashboard Example */}
                                    <VStack gap="lg">
                                        <Box sx="text-2xl font-semibold">Dashboard Layout</Box>
                                        <Box sx="h-64 bg-(--surface-primary) rounded-(--radius-lg) border border-(--border-subtle) p-(--spacing-md)">
                                            <HStack gap="md" sx="h-full">
                                                <VStack
                                                    gap="sm"
                                                    sx="w-48 p-(--spacing-md) bg-(--surface-secondary) rounded-(--radius-md)"
                                                >
                                                    <Box sx="font-semibold">Sidebar</Box>
                                                    <VStack gap="xs">
                                                        <Box sx="p-(--spacing-sm) bg-(--brand-100) rounded">
                                                            Dashboard
                                                        </Box>
                                                        <Box sx="p-(--spacing-sm) bg-(--surface-tertiary) rounded">
                                                            Analytics
                                                        </Box>
                                                        <Box sx="p-(--spacing-sm) bg-(--surface-tertiary) rounded">
                                                            Settings
                                                        </Box>
                                                    </VStack>
                                                </VStack>
                                                <VStack gap="md" sx="flex-1">
                                                    <Box sx="p-(--spacing-md) bg-(--surface-secondary) rounded-(--radius-md) font-semibold">
                                                        Main Content Area
                                                    </Box>
                                                    <Grid columns={3} gap="md" sx="flex-1">
                                                        <Box sx="p-(--spacing-md) bg-gradient-to-br from-(--brand-100) to-(--brand-200) rounded-(--radius-md) text-center">
                                                            📊 Chart
                                                        </Box>
                                                        <Box sx="p-(--spacing-md) bg-gradient-to-br from-(--brand-200) to-(--brand-300) rounded-(--radius-md) text-center">
                                                            📈 Stats
                                                        </Box>
                                                        <Box sx="p-(--spacing-md) bg-gradient-to-br from-(--brand-300) to-(--brand-400) rounded-(--radius-md) text-center text-white">
                                                            🎯 Goals
                                                        </Box>
                                                    </Grid>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </VStack>
                                </VStack>
                            </Container>
                        </Box>

                        {/* Footer */}
                        <Box sx="py-(--spacing-3xl) bg-(--surface-tertiary)">
                            <Container size="4xl" center>
                                <VStack gap="lg" align="center">
                                    <Box sx="text-3xl font-bold text-(--brand-primary)">
                                        🚀 Готов создавать?
                                    </Box>
                                    <Box sx="text-lg text-(--content-secondary) text-center max-w-2xl">
                                        Начни использовать наши компоненты уже сегодня и создавай
                                        невероятные интерфейсы!
                                    </Box>
                                    <HStack gap="md">
                                        <Button variant="primary" size="lg">
                                            Скачать
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            GitHub
                                        </Button>
                                    </HStack>
                                    <Box sx="text-sm text-(--content-tertiary) text-center mt-(--spacing-xl)">
                                        Made with ❤️ using Sky Modules Universal Design System
                                    </Box>
                                </VStack>
                            </Container>
                        </Box>
                    </Layout>
                </LayoutRoot>
            </SXProvider>
        )
    }
}
