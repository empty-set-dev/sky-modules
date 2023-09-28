declare module '*.module.scss' {
    const classnames: Record<string, string>
    export default classnames
}

declare module '*.svg' {
    const content: string
    export default content
}
