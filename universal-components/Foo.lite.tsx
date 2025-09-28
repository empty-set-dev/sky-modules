import { useStore } from '@builder.io/mitosis'

export interface FooProps {
  foo: number
  className?: string
  onClick?: () => void
}

export default function Foo(props: FooProps) {
  const state = useStore({
    count: props.foo || 0,
    increment() {
      state.count++
    }
  })

  return (
    <div
      className={props.className}
      onClick={() => {
        state.increment()
        props.onClick?.()
      }}
      style={{
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9'
      }}
    >
      <h3>Universal Foo Component</h3>
      <p>Initial value: {props.foo}</p>
      <p>Current count: {state.count}</p>
      <button onClick={state.increment}>
        Increment
      </button>
    </div>
  )
}