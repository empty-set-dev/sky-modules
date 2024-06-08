import Layout from 'tests/browser/pages/layout'

const cx = await classnames(`HomePage`, import('./HomePage.module.scss'))

export default function HomePage(props: PageProps): ReactNode {
    return (
        <Layout {...props} title="Home Page">
            <div className={cx`HomePage`}>Hello, World!</div>

            <div className={cx`e:nav`}>
                <a href="/page1/a/b">Page 1</a>
                <a href="/page2/a">Page 2</a>
                <a href="/page3">Page 3</a>
            </div>
        </Layout>
    )
}
