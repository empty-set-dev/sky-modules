import { PropsWithChildren } from 'react'

export {}

declare global {
    interface LayoutProps extends PropsWithChildren {
        styles: ReactNode
        scripts: ReactNode
    }

    interface PageProps extends LayoutProps {}
}
