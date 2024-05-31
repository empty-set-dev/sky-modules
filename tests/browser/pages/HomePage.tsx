import 'tests/browser/imports'

const cx = classnames(`HomePage`, () => import('./HomePage.module.scss'))

export default function HomePage(props: PageProps): ReactNode {
    return (
        <html>
            <head>
                <title>Home Page</title>
                {props.styles}
            </head>
            <body>
                <div className={cx`b:HomePage`}>Hello, World!</div>
                {props.scripts}
            </body>
        </html>
    )
}
