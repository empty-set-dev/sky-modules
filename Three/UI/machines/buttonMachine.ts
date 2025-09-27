// import { createMachine, state, transition, invoke, reduce, immediate } from 'robot3'

// namespace local {
//     export const mockApiRequest = () => {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 // Имитируем успех 80% времени для реалистичности
//                 if (Math.random() > 0.2) {
//                     resolve({ data: 'Данные успешно получены!' })
//                 } else {
//                     reject(new Error('Ошибка сервера!'))
//                 }
//             }, 2000) // Имитируем задержку сети в 2 секунды
//         })
//     }
// }

// const trigger = createMachine(
//     {
//         idle: state(transition('press', 'loading')),

//         pressing: state(immediate('idle')),

//         // Состояние загрузки
//         loading: invoke(
//             // Асинхронная задача, которая будет выполнена при входе в состояние
//             local.mockApiRequest,
//             // При успешном завершении задачи переходим в 'success'
//             transition(
//                 'done',
//                 'success',
//                 // Обновляем контекст данными из результата запроса
//                 reduce((ctx, ev) => ({ ...ctx, data: ev.data, error: null }))
//             ),
//             // При ошибке возвращаемся в 'idle' и сохраняем ошибку
//             transition(
//                 'error',
//                 'idle',
//                 reduce((ctx, ev) => ({ ...ctx, error: ev.error.message, data: null }))
//             )
//         ),

//         // Финальное состояние успешного завершения
//         success: state(),
//     },
//     () => ({ data: null, error: null })
// ) // Начальный контекст машины

// export default buttonMachine
