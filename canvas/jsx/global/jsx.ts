import globalify from '@sky-modules/core/globalify'

import * as imports from '../jsx'

declare global {
    const useCanvas: typeof imports.useCanvas
    const CanvasJSXRenderer: typeof imports.CanvasJSXRenderer
    const Scene: typeof imports.Scene
    const Mesh: typeof imports.Mesh
    const Group: typeof imports.Group
    const Box: typeof imports.Box
    const RectGeometryClass: typeof imports.RectGeometryClass
    const CircleGeometryClass: typeof imports.CircleGeometryClass
    const EllipseGeometryClass: typeof imports.EllipseGeometryClass
    const PathGeometryClass: typeof imports.PathGeometryClass
    const PolylineGeometryClass: typeof imports.PolylineGeometryClass
    const SplineGeometryClass: typeof imports.SplineGeometryClass
    const TextGeometryClass: typeof imports.TextGeometryClass
    const BasicMaterialClass: typeof imports.BasicMaterialClass
    const StrokeMaterialClass: typeof imports.StrokeMaterialClass
    const GradientMaterialClass: typeof imports.GradientMaterialClass
    const StrokeGradientMaterialClass: typeof imports.StrokeGradientMaterialClass
    const PatternMaterialClass: typeof imports.PatternMaterialClass
    const : typeof imports.
    const mergeTailwindClasses: typeof imports.mergeTailwindClasses
    const tailwindClassesToCSS: typeof imports.tailwindClassesToCSS
    const extractDirectCSSProps: typeof imports.extractDirectCSSProps
    const mergeStyles: typeof imports.mergeStyles
    const normalizeProperties: typeof imports.normalizeProperties
    const parseUnit: typeof imports.parseUnit
    const parseSpacing: typeof imports.parseSpacing
    const kebabToCamel: typeof imports.kebabToCamel
    const type ParsedStyles: typeof imports.type ParsedStyles
    type SceneProps = imports.SceneProps
    type MeshProps = imports.MeshProps
    type GroupProps = imports.GroupProps
    type RectGeometryProps = imports.RectGeometryProps
    type CircleGeometryProps = imports.CircleGeometryProps
    type EllipseGeometryProps = imports.EllipseGeometryProps
    type PathGeometryProps = imports.PathGeometryProps
    type PolylineGeometryProps = imports.PolylineGeometryProps
    type SplineGeometryProps = imports.SplineGeometryProps
    type TextGeometryProps = imports.TextGeometryProps
    type StrokeMaterialProps = imports.StrokeMaterialProps
    type GradientMaterialProps = imports.GradientMaterialProps
    type StrokeGradientMaterialProps = imports.StrokeGradientMaterialProps
    type BasicMaterialProps = imports.BasicMaterialProps
    type PatternMaterialProps = imports.PatternMaterialProps
    type CanvasJSXRendererParameters = imports.CanvasJSXRendererParameters
}

globalify({ ...imports })
