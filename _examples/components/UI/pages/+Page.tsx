import Container from 'sky/components/layout/Container'

import styles from './HomePage.module.scss'

export default function HomePage(): ReactNode {
    return (
        <>
            <ContainerExample1 />
            <ContainerExample2 />
        </>
    )
}

const ContainerExample1Cx = cn('[ContainerExample1]', styles)
function ContainerExample1(): ReactNode {
    const cx = ContainerExample1Cx

    return <Container className={cx`[ContainerExample1]`}>Container 1</Container>
}

const ContainerExample2Cx = cn('[ContainerExample2]', styles)
function ContainerExample2(): ReactNode {
    const cx = ContainerExample2Cx
    return <Container className={cx`[ContainerExample2]`}>Container 2</Container>
}
