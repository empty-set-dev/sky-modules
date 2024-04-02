export default (module: object): void => {
    Object.assign(global, module)
}
