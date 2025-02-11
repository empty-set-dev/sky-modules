import logoUrl from '/favicon.svg'

import styles from './PageLayout.module.scss'

const cx = cn('[PageLayout]', styles)

export default function PageLayout({ children }: { children: React.ReactNode }): ReactNode {
    return (
        <Layout>
            <Content>{children}</Content>
        </Layout>
    )
}

function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div className={cx`e:layout`}>
            <h1 className={cx`e:title`}>
                <Logo />
                Sky, React Query
            </h1>
            {children}
        </div>
    )
}

function Content({ children }: { children: React.ReactNode }): ReactNode {
    return <div className={cx`e:content`}>{children}</div>
}

function Logo(): ReactNode {
    return (
        <div className={cx`e:logo`}>
            <a href="/">
                <img src={logoUrl} height={64} width={64} alt="logo" />
            </a>
        </div>
    )
}
