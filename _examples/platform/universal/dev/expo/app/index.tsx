import App from 'App'

const app = new App()

export default function Index(): ReactNode {
    useEffect(() => {
        console.log('HELLO')
    }, [])

    return app.render()
}
