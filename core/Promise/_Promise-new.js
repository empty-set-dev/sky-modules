Promise.new = function newPromise() {
    let resolve;
    const promise = new Promise(resolve_ => (resolve = (result) => {
        resolve_(result);
        return result;
    }));
    return [promise, resolve];
};
export {};
//# sourceMappingURL=_Promise-new.js.map