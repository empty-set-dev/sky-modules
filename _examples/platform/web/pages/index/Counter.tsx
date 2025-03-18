import useStore from 'sky/platform/web/hooks/useStore'

import { CounterStore } from '#/Store'

export default function Counter(): ReactNode {
    const counterStore = useStore(CounterStore)

    return (
        <button
            type="button"
            onClick={(): void => {
                ++counterStore.counter
            }}
        >
            Counter: {counterStore.counter}
        </button>
    )
}
