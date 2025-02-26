export * from 'telefunc'

type TelefucResponse<T> = Promise<[undefined, undefined | T]>
export default TelefucResponse
