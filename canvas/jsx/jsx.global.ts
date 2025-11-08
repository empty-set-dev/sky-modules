import globalify from '@sky-modules/core/globalify'

import * as imports from './jsx'

declare global {
    const useCanvas: typeof imports.useCanvas
    const Scene: typeof imports.Scene
    const Mesh: typeof imports.Mesh
    const Group: typeof imports.Group
    // Box is globally defined in Box.implementation.tsx
    const RectGeometry: typeof imports.RectGeometry
    const CircleGeometry: typeof imports.CircleGeometry
    const EllipseGeometry: typeof imports.EllipseGeometry
    const PathGeometry: typeof imports.PathGeometry
    const PolylineGeometry: typeof imports.PolylineGeometry
    const SplineGeometry: typeof imports.SplineGeometry
    const TextGeometry: typeof imports.TextGeometry
    const StrokeMaterial: typeof imports.StrokeMaterial
    const GradientMaterial: typeof imports.GradientMaterial
    const StrokeGradientMaterial: typeof imports.StrokeGradientMaterial
    const BasicMaterial: typeof imports.BasicMaterial
    const CanvasJSXRenderer: typeof imports.CanvasJSXRenderer

    // CSS and style utilities
    const mergeTailwindClasses: typeof imports.mergeTailwindClasses
    const tailwindClassesToCSS: typeof imports.tailwindClassesToCSS
    const extractDirectCSSProps: typeof imports.extractDirectCSSProps
    const mergeStyles: typeof imports.mergeStyles
    const normalizeProperties: typeof imports.normalizeProperties
    const parseUnit: typeof imports.parseUnit
    const parseSpacing: typeof imports.parseSpacing
    const kebabToCamel: typeof imports.kebabToCamel
    const renderCSSToCanvas: typeof imports.renderCSSToCanvas

    // Types
    type SceneProps = imports.SceneProps
    type MeshProps = imports.MeshProps
    type GroupProps = imports.GroupProps
    // BoxProps is exported from jsx.tsx
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
    type CanvasJSXRendererParameters = imports.CanvasJSXRendererParameters
    type CSSProperties = imports.CSSProperties
    type ParsedStyles = imports.ParsedStyles
}

globalify({ ...imports })
