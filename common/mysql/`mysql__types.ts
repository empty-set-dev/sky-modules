export type mysql__Column = {
    name: string
    type: string
    primary?: boolean
    autoIncrement?: boolean
    unique?: boolean
    default?: string
    notNull?: boolean
    codepage?: string
}

export type mysql__Index = {
    name?: string
    type: string
    columns: string[]
}
