/// <reference types="./react.global" />
import module from 'react'
import globalify from 'utilities/globalify/globalify'

globalify({
    React: module,
    useEffect: module.useEffect,
    useState: module.useState,
    useMemo: module.useMemo,
    useCallback: module.useCallback,
    forwardRef: module.forwardRef,
    useImperativeHandle: module.useImperativeHandle,
    useRef: module.useRef,
})

declare global {
    namespace React {}
    interface React {}

    type ReactNode = module.ReactNode
    type FC = module.FC

    const useEffect: typeof module.useEffect
    const useState: typeof module.useState
    const useMemo: typeof module.useMemo
    const useCallback: typeof module.useCallback
    const forwardRef: typeof module.forwardRef
    const useImperativeHandle: typeof module.useImperativeHandle
    const useRef: typeof module.useRef
}
