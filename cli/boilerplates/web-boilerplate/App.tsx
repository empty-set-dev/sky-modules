import '#setup'

interface AppProps {
    screen: unknown
}
define('{{APP_ID}}.App', App)
export default function App(props: AppProps) {
    const { screen } = props
    return screen
}
