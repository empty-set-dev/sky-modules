import { PropsWithChildren, ReactNode } from 'react'

define('sky.playground.react.App', App)
export default function App({ children }: PropsWithChildren): ReactNode {
    return children
}
