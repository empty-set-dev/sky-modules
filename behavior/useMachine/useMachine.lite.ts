import { useState } from '@builder.io/mitosis'
import { GetTransitionsFromStates, interpret, Machine, MachineStates, Service } from 'robot3'

/**
 * Mitosis hook for integrating robot3 finite state machines in cross-framework components.
 *
 * This hook provides a reactive interface to robot3 state machines, automatically
 * re-rendering components when the machine state changes. It works across all
 * frameworks supported by Mitosis (React, Vue, Solid, Svelte, Qwik, Angular).
 *
 * @template T The machine states type
 * @param machine The robot3 machine instance to interpret
 * @returns A tuple of [service, send] where:
 *          - service: The current machine service (contains current state)
 *          - send: Function to send events to the machine
 *
 * @example Basic state machine
 * ```typescript
 * import { useMachine } from '@sky-modules/behavior/useMachine'
 * import { createMachine, state, transition } from 'robot3'
 *
 * const toggleMachine = createMachine({
 *   inactive: state(
 *     transition('toggle', 'active')
 *   ),
 *   active: state(
 *     transition('toggle', 'inactive')
 *   )
 * })
 *
 * function ToggleComponent() {
 *   const [service, send] = useMachine(toggleMachine)
 *
 *   return (
 *     <button onClick={() => send('toggle')}>
 *       {service.machine.current}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example Complex state machine with guards
 * ```typescript
 * const counterMachine = createMachine({
 *   zero: state(
 *     transition('inc', 'positive'),
 *     transition('dec', 'negative')
 *   ),
 *   positive: state(
 *     transition('inc', 'positive'),
 *     transition('dec', 'zero')
 *   ),
 *   negative: state(
 *     transition('inc', 'zero'),
 *     transition('dec', 'negative')
 *   )
 * })
 *
 * function Counter() {
 *   const [service, send] = useMachine(counterMachine)
 *
 *   return (
 *     <div>
 *       <span>State: {service.machine.current}</span>
 *       <button onClick={() => send('inc')}>+</button>
 *       <button onClick={() => send('dec')}>-</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useMachine<T extends MachineStates<T, string>>(
    machine: Machine<T, {}, string, string>
): [
    Service<Machine<T, {}, string, string>>,
    (
        event:
            | { [K in keyof GetTransitionsFromStates<T>]: GetTransitionsFromStates<T>[K] }[keyof T]
            | {
                  [key: string]: unknown
                  type: {
                      [K in keyof GetTransitionsFromStates<T>]: GetTransitionsFromStates<T>[K]
                  }[keyof T]
              }
    ) => void,
] {
    const [service, setService] = useState(() => interpret(machine, () => setService))

    const send = (
        event:
            | { [K in keyof GetTransitionsFromStates<T>]: GetTransitionsFromStates<T>[K] }[keyof T]
            | {
                  [key: string]: unknown
                  type: {
                      [K in keyof GetTransitionsFromStates<T>]: GetTransitionsFromStates<T>[K]
                  }[keyof T]
              }
    ): void => {
        service().send(event)
    }

    return [service(), send]
}
