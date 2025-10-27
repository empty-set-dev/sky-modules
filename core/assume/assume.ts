type assume = typeof assume
function assume<T>(value: unknown): asserts value is T {
    //
}

export default assume
