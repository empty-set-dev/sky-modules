import 'tests/browser/imports'

const cx = classnames(`HomePage`, () => import('./HomePage.module.scss'))

export default function HomePage(): ReactNode {
    return <div className={cx`b:HomePage`}>Hello, World!</div>
}
