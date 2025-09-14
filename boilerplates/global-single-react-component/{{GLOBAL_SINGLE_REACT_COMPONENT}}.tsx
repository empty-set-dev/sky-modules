iAm('{{GLOBAL_SINGLE_REACT_COMPONENT}}', import('./{{GLOBAL_SINGLE_REACT_COMPONENT}}'))

declare global {
    interface Modules {
        '{{GLOBAL_SINGLE_REACT_COMPONENT}}': typeof import('./{{GLOBAL_SINGLE_REACT_COMPONENT}}')
    }
}

export interface $GLOBAL_SINGLE_REACT_COMPONENTProps {

}
export default function $GLOBAL_SINGLE_REACT_COMPONENT(props: $GLOBAL_SINGLE_REACT_COMPONENTProps): ReactNode {
    return <>Hello, world!</>
}
