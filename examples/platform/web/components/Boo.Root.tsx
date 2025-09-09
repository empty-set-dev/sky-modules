import Boo from './Boo'

export default function BooRoot(props: BooVariants & PropsWithChildren): ReactNode {
    const styles = Boo.styles(props).root()
    return <Box sx={styles}>{props.children}</Box>
}
