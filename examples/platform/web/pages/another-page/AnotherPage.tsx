import '#/imports'
import 'sky/react/components/layout/Box.global'

export default function AnotherPage(): ReactNode {
    const Link = sx(`
        align-center
        flex
        justify-center
        px-2
        py-2
        font-mono
    `)

    return (
        <>
            <Link asChild>
                <a href="/">Link</a>
            </Link>
        </>
    )
}
