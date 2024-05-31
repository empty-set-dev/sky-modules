const cx = await classnames(`HomePage`, () => import('./HomePage.module.scss'))

export default function HomePage(props: PageProps): ReactNode {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Home Page</title>
                <link rel="icon" type="image/x-icon" href="/favicon.svg" />
                {props.styles}
            </head>
            <body>
                <div className={cx`HomePage`}>Hello, World!</div>
                {props.scripts}
            </body>
        </html>
    )
}
