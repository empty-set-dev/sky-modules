Array.prototype.toShuffled = function toShuffled() {
    return this.slice().shuffle();
};
Object.defineProperty(Array.prototype, 'toShuffled', {
    enumerable: false,
});
export {};
//# sourceMappingURL=Array+toShuffled.js.map