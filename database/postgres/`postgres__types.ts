export type postgres__Column = {
    name: string
    type: string
    primary?: boolean
    autoIncrement?: boolean
    unique?: boolean
    default?: unknown
    notNull?: boolean
    codepage?: string
}

export type postgres__Index = {
    name?: string
    type: string
    columns: string[]
}
