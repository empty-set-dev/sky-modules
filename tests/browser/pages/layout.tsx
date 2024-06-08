declare global {
    interface LayoutProps {
        title: string
    }
}

export default function Layout(props: LayoutProps): ReactNode {
    const { scripts, styles, children, title } = props
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="icon" type="image/x-icon" href="/favicon.svg" />
                {styles}
            </head>
            {children}
            <body>{scripts}</body>
        </html>
    )
}
