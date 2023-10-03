/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = function Fc() {
    return {
        visitor: {
            Identifier(path) {
                console.log(path.node)
            },
        },
    }
}
