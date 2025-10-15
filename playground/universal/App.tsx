import '#setup'

import { ReactNode, useState } from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'

import { SXProvider } from '#/x/design/SX'
import { LayoutRoot } from '#/x/universal/layout/Layout'

import routes from '~react-pages'

function Header(): ReactNode {
    return (
        <header
            style={{
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#fff',
            }}
        >
            <nav
                style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                }}
            >
                <Link
                    to="/"
                    style={{
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        textDecoration: 'none',
                        color: '#1a202c',
                    }}
                >
                    Universal Playground
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#4a5568' }}>
                        Home
                    </Link>
                    <Link to="/playground" style={{ textDecoration: 'none', color: '#4a5568' }}>
                        Playground
                    </Link>
                </div>
            </nav>
        </header>
    )
}

function Routes(): ReactNode {
    return useRoutes(routes)
}

define('sky.playground.universal.App', App)
export default function App(): ReactNode {
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    return (
        <SXProvider brand="universal-example-brand" initialTheme={theme} initialPalette={palette}>
            <LayoutRoot variant="landing" fullHeight="viewport">
                <BrowserRouter>
                    <Header />
                    <Routes />
                </BrowserRouter>
            </LayoutRoot>
        </SXProvider>
    )
}
