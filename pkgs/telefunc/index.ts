export * from 'telefunc'

export type TelefuncResponse<T = void, E = string> = Promise<[undefined | T, undefined | E]>
