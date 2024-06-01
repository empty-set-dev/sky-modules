const cx = await classnames(`HomePage`, import('./HomePage.module.scss'))

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
                <div className={cx`e:nav`}>
                    <a href="/page1/a/b">Page 1</a>
                    <a href="/page2/a">Page 2</a>
                    <a href="/page3">Page 3</a>
                </div>
                {props.scripts}
            </body>
        </html>
    )
}
