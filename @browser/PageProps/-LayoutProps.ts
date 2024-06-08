import { PropsWithChildren } from 'react'

export default interface PageProps extends PropsWithChildren {
    styles: ReactNode
    scripts: ReactNode
}
