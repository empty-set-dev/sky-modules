import React, {
    act,
    cloneElement,
    createContext,
    createElement,
    createRef,
    forwardRef,
    isValidElement,
    lazy,
    memo,
    startTransition,
    useCallback,
    useContext,
    useDebugValue,
    useDeferredValue,
    useEffect,
    useId,
    useImperativeHandle,
    useInsertionEffect,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useSyncExternalStore,
    useState,
    useTransition,
} from 'react'
import globalify from 'sky/utilities/globalify'

globalify({
    React,
    act,
    cloneElement,
    createContext,
    createElement,
    createRef,
    forwardRef,
    isValidElement,
    lazy,
    memo,
    startTransition,
    useCallback,
    useContext,
    useDebugValue,
    useDeferredValue,
    useEffect,
    useId,
    useImperativeHandle,
    useInsertionEffect,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useSyncExternalStore,
    useState,
    useTransition,
})

declare global {
    type React = void

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
}
