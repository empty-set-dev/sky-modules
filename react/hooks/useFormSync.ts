// import { runInAction } from 'mobx'
// import { useEffect } from 'react'
// import { FieldValues, Path, UseFormSetValue, UseFormWatch } from 'react-hook-form'

// export interface UseFormSyncParameters<T extends FieldValues> {
//     watch: UseFormWatch<T>
//     setValue: UseFormSetValue<T>
// }
// export default function useFormSync<T extends object>(
//     initialState: T,
//     state: T,
//     { setValue, watch }: UseFormSyncParameters<T>
// ): void {
//     const watchFields = watch()

//     useEffect(() => {
//         Object.keys(state).forEach(k => {
//             if (k === 'errors') {
//                 return
//             }

//             if (
//                 (state[k as keyof T] !== initialState[k as keyof T] || watchFields[k as keyof T]) &&
//                 watchFields[k as keyof T] !== state[k as keyof T]
//             ) {
//                 setValue(k as Path<T>, state[k as keyof T] as never, {
//                     shouldDirty: true,
//                 })
//             }
//         })
//     }, [])

//     runInAction(() => {
//         Object.keys(watchFields).forEach(k => {
//             if (k === 'errors') {
//                 return
//             }

//             if (state[k as keyof T] !== watchFields[k as keyof T]) {
//                 state[k as keyof T] = watchFields[k as keyof T]
//             }
//         })
//     })
// }
