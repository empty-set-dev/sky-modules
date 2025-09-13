export { default as LinkStyles } from './Link.module.scss'
import type { JSX } from 'react/jsx-runtime'

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {}
export default function Link(props: LinkProps): JSX.Element {
    return <a {...props} />
}
