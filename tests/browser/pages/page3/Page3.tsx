import Layout from '../layout'

export default function Page3(props: PageProps): ReactNode {
    return (
        <Layout {...props} title="Page 3">
            <h1>Page 3</h1>
            <a href="/">Home</a>
        </Layout>
    )
}
