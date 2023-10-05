import module from 'node_modules/react'
import moduleNs from 'react'
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

    const useEffect: typeof module.useEffect
    const useState: typeof module.useState
    const useMemo: typeof module.useMemo
    const useCallback: typeof module.useCallback
    const forwardRef: typeof module.forwardRef
    const useImperativeHandle: typeof module.useImperativeHandle
    const useRef: typeof module.useRef
}
