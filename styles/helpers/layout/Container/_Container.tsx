import cn from 'sky/helpers/cn'

import * as styles from './_Container.scss'

const cx = cn(styles)

export default function Container(): ReactNode {
    return <div className={cx`container`}>container</div>
}
