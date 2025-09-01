import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ PromisesPool: lib.default })

declare global {
    interface PromiseConstructor {
        Pool: typeof lib.default
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const promisePool = new Promise.Pool()
// TODO
// const promisePool = async (functions, n) => {
//   const worker = async () => {
//     const fn = functions.shift();

//     if (fn) {
//       await fn();
//       await worker();
//     }
//   };

//   await Promise.all(Array.from(Array(n)).map(worker));
// };
