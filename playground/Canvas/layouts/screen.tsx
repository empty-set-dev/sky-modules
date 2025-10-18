import { Link } from 'react-router-dom'

export default function ScreenLayout(props: BoxProps & PropsWithChildren): ReactNode {
    const { children, ...boxProps } = props
    return (
        <Box {...boxProps} sx="screen">
            <header className="p-4 border-b-[1px] border-b-(--border-primary) bg-white">
                <nav className="flex gap-8 items-center">
                    <Link to="/" className="font-bold text-size-lg no-underline text-primary">
                        Universal Playground
                    </Link>
                    <div className="flex gap-4">
                        <Link to="/" className="no-underline text-secondary">
                            Home
                        </Link>
                        <Link to="/playground" className="no-underline text-secondary">
                            Playground
                        </Link>
                    </div>
                </nav>
            </header>
            {children}
        </Box>
    )
}
