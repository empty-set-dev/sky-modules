Array.prototype.remove = function remove(element) {
    const elementIndex = this.indexOf(element);
    if (elementIndex === -1) {
        return false;
    }
    this.splice(elementIndex, 1);
    return true;
};
Object.defineProperty(Array.prototype, 'remove', {
    enumerable: false,
});
export {};
//# sourceMappingURL=Array+remove.js.map