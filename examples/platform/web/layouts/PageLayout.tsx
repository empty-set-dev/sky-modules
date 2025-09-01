import faviconSvg from 'public/favicon.svg'
import Link from 'sky/react/components/Link'

import './PageLayout.scss'

import 'sky/styles/helpers/page'

export default function PageLayout({ children }: { children: React.ReactNode }): ReactNode {
    return (
        <Layout>
            <Sidebar>
                <Logo />
                <Link href="/">Welcome</Link>
                <Link href="/about">About</Link>
                <Link href="/data-fetching">Data Fetching</Link>
                <Link href="/react-query">React Query</Link>
            </Sidebar>
            <Content>{children}</Content>
        </Layout>
    )
}

function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div
            className="Page"
            style={{
                display: 'flex',
                maxWidth: 900,
                margin: 'auto',
            }}
        >
            {children}
        </div>
    )
}

function Sidebar({ children }: { children: ReactNode }): ReactNode {
    return (
        <div
            id="sidebar"
            style={{
                padding: 20,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.8em',
                borderRight: '2px solid #eee',
            }}
        >
            {children}
        </div>
    )
}

function Content({ children }: { children: React.ReactNode }): ReactNode {
    return (
        <div id="page-container">
            <div
                id="page-content"
                style={{
                    padding: 20,
                    paddingBottom: 50,
                    // minHeight: '100vh',
                }}
            >
                {children}
            </div>
        </div>
    )
}

function Logo(): ReactNode {
    return (
        <div
            style={{
                marginTop: 20,
                marginBottom: 10,
            }}
        >
            <a href="/">
                <img src={faviconSvg} height={64} width={64} alt="logo" />
            </a>
        </div>
    )
}
