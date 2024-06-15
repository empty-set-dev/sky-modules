import 'tests/browser/imports'

const cx = await classnames('AboutPage', import('./AboutPage.scss'))

export function Page(): ReactNode {
    return (
        <div className={cx`AboutPage`}>
            <h1 className={cx`e:title`}>About</h1>
            <p className={cx`e:text`}>Example of using Sky.</p>
        </div>
    )
}
