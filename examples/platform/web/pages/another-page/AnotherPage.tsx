import '#/imports'
import 'sky/react/components/layout/Box.global'

export default function HomePage(props): ReactNode {
    console.log('render', props)
    return (
        <>
            <Box asChild sx="flex justify-center align-center">
                <a href="/">Home</a>
            </Box>
        </>
    )
}
