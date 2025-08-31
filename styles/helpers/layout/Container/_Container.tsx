import styles from './_Container.scss'
import { cx } from 'sky/helpers/cn'

const cx = cn(styles)

export default function Container(): ReactNode {
    return <div className="container">container</div>
}
