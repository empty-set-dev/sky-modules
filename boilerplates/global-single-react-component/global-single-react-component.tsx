iAm('global-single-react-component', import('./global-single-react-component'))

declare global {
    interface Modules {
        'global-single-react-component': typeof import('./global-single-react-component')
    }
}

export interface global-single-react-componentProps {
    
}
export default function global-single-react-component(props: global-single-react-componentProps) {
    return <>Hello, world!</>
}
