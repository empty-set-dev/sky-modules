import { observer  } from 'mobx-react-lite'
import useStore from 'sky/platform/web/hooks/useStore'

import { CounterStore } from '#/stores/CounterStore'

export default observer(function Counter(): ReactNode {
    const { counter, setCounter } = useStore(CounterStore)

    return (
        <button
            type="button"
            onClick={(): void => {
                setCounter(counter + 1)
            }}
        >
            Counter: {counter}
        </button>
    )
})
