export { Counter }

import { useState } from 'react'

function Counter(): ReactNode {
    const [count, setCount] = useState(0)
    return (
        <button type="button" onClick={(): void => setCount(count => count + 1)}>
            Counter {count}
        </button>
    )
}
