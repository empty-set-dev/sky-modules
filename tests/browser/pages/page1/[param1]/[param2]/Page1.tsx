import Test from 'tests/browser/components/Test'
import Layout from 'tests/browser/pages/layout'

export default function Page1(props: PageProps): ReactNode {
    return (
        <Layout {...props} title="Page 1">
            <h1>Page 1</h1>
            <Test />
            <a href="/">Home</a>
        </Layout>
    )
}
