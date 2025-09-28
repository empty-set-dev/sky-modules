import useStore from '@sky-modules/platform/web/hooks/useStore'

import { CounterStore } from '#/stores/CounterStore'

export default function Counter(): ReactNode {
    const counter = useStore(CounterStore)

    return (
        <button
            type="button"
            onClick={(): void => {
                counter.setCount(counter.count + 1)
            }}
        >
            Counter: {counter.count}
        </button>
    )
}
