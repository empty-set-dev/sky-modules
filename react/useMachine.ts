import { useState } from 'react'
import { GetTransitionsFromStates, interpret, Machine, MachineStates, Service } from 'robot3'

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
        service.send(event)
    }

    return [service, send]
}
