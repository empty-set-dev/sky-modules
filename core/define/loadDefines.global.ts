import loadDefines, * as imports from './loadDefines'

declare global {
    function loadDefines(defines: internal.Defines): void
}

Object.assign(global, { loadDefines, ...imports })
