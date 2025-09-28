import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ PromisesPool: lib.default })

declare global {
    interface PromiseConstructor {
        Pool: typeof lib.default
    }
}

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
