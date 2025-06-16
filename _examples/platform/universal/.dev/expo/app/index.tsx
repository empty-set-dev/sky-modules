import App from '#/App'

const app = new App()

export default function Index(): ReactNode {
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('HELLO')
    }, [])

    return app.render()
}
