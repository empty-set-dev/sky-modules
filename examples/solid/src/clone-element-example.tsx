import { createSignal, JSX, splitProps, mergeProps, children as resolveChildren } from 'solid-js'

// Функция для клонирования элемента в SolidJS
function cloneElement<T extends Element = Element>(
    element: JSX.Element,
    props?: Partial<JSX.IntrinsicElements[keyof JSX.IntrinsicElements]> & {
        children?: JSX.Element
    },
    ...additionalChildren: JSX.Element[]
): JSX.Element {
    if (typeof element === 'function') {
        // Если элемент - это компонент-функция
        const newProps = props ? mergeProps(element.props || {}, props) : element.props
        return element(newProps)
    }

    if (typeof element === 'object' && element && 'type' in element) {
        // Если элемент - это JSX элемент
        const [newProps, children] = splitProps(props || {}, ['children'])
        const hasNewChildren = children.children !== undefined || additionalChildren.length > 0

        return {
            ...element,
            props: mergeProps(
                element.props || {},
                newProps,
                hasNewChildren
                    ? {
                          children:
                              children.children !== undefined
                                  ? children.children
                                  : additionalChildren.length === 1
                                    ? additionalChildren[0]
                                    : additionalChildren,
                      }
                    : {}
            ),
        }
    }

    return element
}

// Компонент для демонстрации
function CloneElementDemo() {
    const [count, setCount] = createSignal(0)

    // Исходный элемент
    const originalButton = (
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px', margin: '5px' }}>
            Счетчик: {count()}
        </button>
    )

    // Клонированный элемент с новыми пропсами
    const clonedButton = cloneElement(originalButton, {
        style: {
            padding: '15px',
            margin: '10px',
            backgroundColor: 'lightblue',
            border: 'none',
            borderRadius: '5px',
        },
    })

    // Клонированный элемент с новыми детьми
    const clonedWithNewChildren = cloneElement(originalButton, {
        style: {
            padding: '12px',
            margin: '8px',
            backgroundColor: 'lightgreen',
            border: 'none',
            borderRadius: '5px',
        },
        children: `Новый текст: ${count()}`,
    })

    return (
        <div style={{ padding: '20px' }}>
            <h2>Пример клонирования элементов в SolidJS</h2>

            <div style={{ margin: '20px 0' }}>
                <h3>Оригинальная кнопка:</h3>
                {originalButton}
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Клонированная кнопка с новыми стилями:</h3>
                {clonedButton}
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Клонированная кнопка с новыми детьми:</h3>
                {clonedWithNewChildren}
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Клонирование компонента:</h3>
                <ComponentCloneExample />
            </div>
        </div>
    )
}

// Пример клонирования пользовательского компонента
function MyComponent(props: { color?: string; children?: JSX.Element }) {
    return (
        <div
            style={{
                color: props.color || 'black',
                padding: '10px',
                border: '1px solid gray',
                margin: '5px',
            }}
        >
            {props.children}
        </div>
    )
}

function ComponentCloneExample() {
    const originalComponent = <MyComponent color="blue">Оригинальный компонент</MyComponent>

    const clonedComponent = cloneElement(originalComponent, {
        color: 'red',
        children: 'Клонированный компонент',
    })

    return (
        <div>
            {originalComponent}
            {clonedComponent}
        </div>
    )
}

export default CloneElementDemo
