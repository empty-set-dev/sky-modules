const arrayPrototype = Object.defineProperties({}, Object.getOwnPropertyDescriptors(Array.prototype));
arrayPrototype.copyWithin = function (target, start, end) {
    Array.prototype.copyWithin.call(this, target, start, end);
    return this;
};
arrayPrototype.fill = function (value, start, end) {
    Array.prototype.fill.call(this, value, start, end);
    return this;
};
export default function array(array) {
    Object.setPrototypeOf(array, arrayPrototype);
    return array;
}
// const arr = array([1, 2, 3])
// arr.fill(42, 0, 100)
// Console.log(arr)
//# sourceMappingURL=__array.js.map