import React from 'react'
import globalify from 'sky/standard/globalify'

import captureUI, { CaptureUIResult } from './_captureUI'

globalify({
    React,
    act: React.act,
    cloneElement: React.cloneElement,
    createContext: React.createContext,
    createElement: React.createElement,
    createRef: React.createRef,
    forwardRef: React.forwardRef,
    isValidElement: React.isValidElement,
    lazy: React.lazy,
    memo: React.memo,
    startTransition: React.startTransition,
    use: React.use,
    useActionState: React.useActionState,
    useCallback: React.useCallback,
    useContext: React.useContext,
    useDebugValue: React.useDebugValue,
    useDeferredValue: React.useDeferredValue,
    useEffect: React.useEffect,
    useId: React.useId,
    useImperativeHandle: React.useImperativeHandle,
    useInsertionEffect: React.useInsertionEffect,
    useLayoutEffect: React.useLayoutEffect,
    useMemo: React.useMemo,
    useReducer: React.useReducer,
    useRef: React.useRef,
    useSyncExternalStore: React.useSyncExternalStore,
    useState: React.useState,
    useTransition: React.useTransition,
    useOptimistic: React.useOptimistic,
    captureUI,
})

declare global {
    type React = {}

    type CSSProperties = React.CSSProperties
    type ReactNode = React.ReactNode
    type PropsWithChildren = React.PropsWithChildren
    type FC = React.FC

    const act: typeof React.act
    const cloneElement: typeof React.cloneElement
    const createContext: typeof React.createContext
    const createElement: typeof React.createElement
    const createRef: typeof React.createRef
    const forwardRef: typeof React.forwardRef
    const isValidElement: typeof React.isValidElement
    const lazy: typeof React.lazy
    const memo: typeof React.memo
    const startTransition: typeof React.startTransition
    const useCallback: typeof React.useCallback
    const useContext: typeof React.useContext
    const useDebugValue: typeof React.useDebugValue
    const useDeferredValue: typeof React.useDeferredValue
    const useEffect: typeof React.useEffect
    const useId: typeof React.useId
    const useImperativeHandle: typeof React.useImperativeHandle
    const useInsertionEffect: typeof React.useInsertionEffect
    const useLayoutEffect: typeof React.useLayoutEffect
    const useMemo: typeof React.useMemo
    const useReducer: typeof React.useReducer
    const useRef: typeof React.useRef
    const useSyncExternalStore: typeof React.useSyncExternalStore
    const useState: typeof React.useState
    const useTransition: typeof React.useTransition

    function captureUI(effect: Effect | EffectsRoot): CaptureUIResult
}
