import * as module from 'react'
import globalify from 'utilities/globalify'

globalify({ React: module })

declare global {
    type ReactNode = module.ReactNode
    type Component = module.Component
    type FC = module.FC

    const useEffect: typeof module.useEffect
    const useMemo: typeof module.useMemo
    const useCallback: typeof module.useCallback
    const forwardRef: typeof module.forwardRef
    const useImperativeHandle: typeof module.useImperativeHandle
    const useRef: typeof module.useRef
}
