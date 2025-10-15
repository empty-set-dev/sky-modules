import { Link } from 'react-router-dom'

export default function ScreenLayout(props: PropsWithChildren): ReactNode {
    const { children } = props
    return (
        <>
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
            {children}
        </>
    )
}
