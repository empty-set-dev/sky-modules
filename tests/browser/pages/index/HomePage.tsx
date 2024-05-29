const cx = classnames(`HomePage`, () => import('./Home.module.scss'))

export default function HomePage(): ReactNode {
    return <div className={cx`b:HomePage`}>Hello, World!</div>
}
