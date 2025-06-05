import styles from './IndexPage.module.scss'

const cx = cn('[IndexPage]', styles)
export default function IndexPage(): ReactNode {
    return (
        <div className={cx`[IndexPage]`}>
            <header>
                <div className="container ContainerExample1">container</div>
                <div className="container ContainerExample2">container</div>
                <div className="container ContainerExample3">
                    <div className="row">
                        <div className={cx`col`}>1</div>
                        <div className={cx`col`}>2</div>
                        <div className={cx`col`}>3</div>
                    </div>
                </div>
            </header>
        </div>
    )
}
