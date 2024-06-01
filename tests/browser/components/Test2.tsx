const cx = await classnames('Test', import('./Test2.module.scss'))

export default function Test(): ReactNode {
    return <div className={cx`Test2`}>Test 2</div>
}
