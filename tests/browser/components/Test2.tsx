const cx = await classnames('Test', import('./Test2.module.scss'))

export default function Test(): ReactNode {
    (global as any).georjerg()
    return <div className={cx`b:Test2`}>Test 2</div>
}
