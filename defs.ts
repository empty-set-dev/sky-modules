declare module '*.module.css' {
    const classnames: Record<string, string>
    export = classnames
}

declare module '*.module.scss' {
    const classnames: Record<string, string>
    export = classnames
}

declare module '*.module.sass' {
    const classnames: Record<string, string>
    export = classnames
}

declare module '*.svg' {
    const content: string
    export default content
}

declare module '*.png' {
    const content: string
    export default content
}

declare module '*.jpg' {
    const content: string
    export default content
}

declare module '*.woff2' {
    const content: string
    export default content
}
