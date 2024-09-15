import React from 'react'
import globalify from 'sky/helpers/globalify'

globalify({
    React,
    useEffect: React.useEffect,
    useState: React.useState,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    forwardRef: React.forwardRef,
    useImperativeHandle: React.useImperativeHandle,
    useRef: React.useRef,
})

declare global {
    namespace React {}
    interface React {}

    type ReactNode = React.ReactNode
    type PropsWithChildren = React.PropsWithChildren
    type FC = React.FC

    const useEffect: typeof React.useEffect
    const useState: typeof React.useState
    const useMemo: typeof React.useMemo
    const useCallback: typeof React.useCallback
    const forwardRef: typeof React.forwardRef
    const useImperativeHandle: typeof React.useImperativeHandle
    const useRef: typeof React.useRef
}
