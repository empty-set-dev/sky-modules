Array.prototype.shuffle = function shuffle() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
Object.defineProperty(Array.prototype, 'shuffle', {
    enumerable: false,
});
export {};
//# sourceMappingURL=Array+shuffle.js.map