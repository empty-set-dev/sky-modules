import Test2 from 'tests/browser/components/Test2'

import Layout from '../../layout'

export default function Page2(props: PageProps): ReactNode {
    return (
        <Layout {...props} title="Page 2">
            <h1>Page 2</h1>
            <Test2 />
            <a href="/">Home</a>
        </Layout>
    )
}
