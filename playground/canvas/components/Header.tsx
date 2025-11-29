import '@sky-modules/canvas/jsx/box/Box.implementation'

import { JSX } from 'sky-jsx'

export interface HeaderProps {
    currentPage?: string
}

export function Header({ currentPage = 'home' }: HeaderProps): JSX.Element {
    return (
        <Box
            height={60}
            backgroundColor="#1e293b"
            padding={15}
            display="flex"
            flexDirection="row"
            gap={20}
            alignItems="center"
        >
            {/* Logo */}
            <Box color="#ffffff" fontSize={20} fontWeight={700}>
                Canvas Playground
            </Box>

            {/* Nav Links */}
            <Box display="flex" flexDirection="row" gap={15} flexGrow={1}>
                <NavLink href="/" label="Home" active={currentPage === 'home'} />
                <NavLink href="/samples" label="Samples" active={currentPage === 'samples'} />
                <NavLink href="/rect" label="Rect" active={currentPage === 'rect'} />
                <NavLink
                    href="/playground"
                    label="Playground"
                    active={currentPage === 'playground'}
                />
            </Box>
        </Box>
    )
}

interface NavLinkProps {
    href: string
    label: string
    active?: boolean
}

function NavLink({ label, active }: NavLinkProps): JSX.Element {
    return (
        <Box
            padding="8px 16px"
            backgroundColor={active ? '#3b82f6' : 'transparent'}
            color="#ffffff"
            fontSize={14}
            fontWeight={active ? 600 : 400}
            borderRadius={6}
        >
            {label}
        </Box>
    )
}
