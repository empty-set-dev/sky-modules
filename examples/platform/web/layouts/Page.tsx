import Link from 'sky/react/components/Link'

import styles from './Page.module.scss'

import faviconSvg from '@/favicon.svg'

import 'sky/styles/helpers/page'

const cx = cn(styles)

export default function Page({
    children,
    ...boxProps
}: { children: React.ReactNode } & BoxProps): ReactNode {
    return (
        <Root {...boxProps}>
            <Sidebar>
                <Logo />
                <Link href="/">Welcome</Link>
                <Link href="/about">About</Link>
                <Link href="/data-fetching">Data Fetching</Link>
                <Link href="/react-query">React Query</Link>
            </Sidebar>
            <Content>{children}</Content>
        </Root>
    )
}

function Root({ children, ...boxProps }: { children: ReactNode } & BoxProps): ReactNode {
    return (
        <Box {...boxProps} className={cx('@Page', boxProps.className)}>
            {children}
        </Box>
    )
}

function Sidebar({ children }: { children: ReactNode }): ReactNode {
    return (
        <div id="sidebar" className={cx`@sidebar`}>
            {children}
        </div>
    )
}

function Content({ children }: { children: React.ReactNode }): ReactNode {
    return (
        <div className="page-container">
            <div
                id="page-content"
                style={{
                    padding: 20,
                    paddingBottom: 50,
                    minHeight: '100vh',
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
                marginTop: 10,
                marginBottom: 10,
            }}
        >
            <a href="/">
                <img src={faviconSvg} height={64} width={64} alt="logo" />
            </a>
        </div>
    )
}
