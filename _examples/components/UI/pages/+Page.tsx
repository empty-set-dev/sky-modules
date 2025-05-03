import Container from "sky/components/layout/Container";

import styles from './HomePage.module.scss'

const cx = cn('[HomePage]', styles)
const b = `HomePage`;
export default function HomePage() {

    return (
        <>
            <ContainerExample1 />
            <ContainerExample2 />
        </>
    )
}

function ContainerExample1() {
    return (
        <Container className={cx`ContainerExample1`}>
            Container 1
        </Container>
    )
}

function ContainerExample2() {
    return (
        <Container className={cx`ContainerExample2`}>
            Container 2
        </Container>
    )
}
