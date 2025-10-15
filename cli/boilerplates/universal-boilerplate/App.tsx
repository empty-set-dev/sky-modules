import '#setup'

interface AppProps {
    screen: ReactNode
}
define('{{APP_ID}}.App', App)
export default function App(props: AppProps): ReactNode {
    const { screen } = props
    return screen
}
