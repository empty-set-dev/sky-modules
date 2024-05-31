import Test2 from './Test2'

const cx = await classnames('Test', import('./Test.module.scss'))

export default function Test(): ReactNode {
    return (
        <div className={cx`b:Test`}>
            <Test2 />
        </div>
    )
}
