iAm('Box', import('./Box'))

declare global {
    interface Modules {
        'Box': typeof import('./Box')
    }
}

export interface global-single-react-componentProps {
    
}
export default function global-single-react-component(props: global-single-react-componentProps) {
    return <>Hello, world!</>
}
