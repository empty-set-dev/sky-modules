import '#setup'
import { ReactNode } from 'react'

define('sky.playground.react.App', App)
export default function App({ screen }: { screen: ReactNode }): ReactNode {
    return screen
}
