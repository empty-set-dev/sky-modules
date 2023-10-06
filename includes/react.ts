import * as module from 'node_modules/react'
import * as moduleNs from 'react'
import globalify from 'utilities/globalify'

globalify({
    module: module,
    useEffect: module.useEffect,
    useState: module.useState,
    useMemo: module.useMemo,
    useCallback: module.useCallback,
    forwardRef: module.forwardRef,
    useImperativeHandle: module.useImperativeHandle,
    useRef: module.useRef,
})

declare global {
    type ReactNode = moduleNs.ReactNode
    type Component = moduleNs.Component
    type FC = moduleNs.FC

    const useEffect: typeof moduleNs.useEffect
    const useState: typeof moduleNs.useState
    const useMemo: typeof moduleNs.useMemo
    const useCallback: typeof moduleNs.useCallback
    const forwardRef: typeof moduleNs.forwardRef
    const useImperativeHandle: typeof moduleNs.useImperativeHandle
    const useRef: typeof moduleNs.useRef
}
