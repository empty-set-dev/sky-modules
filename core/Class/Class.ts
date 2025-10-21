// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<T extends new (...args: any[]) => any = new (...args: any[]) => any> = T
export default Class
