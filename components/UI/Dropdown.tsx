import cn from 'pkgs/classnames'
import React, { useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import './Dropdown.scss'
import Button from './Button'

export interface DropdownProps<T extends FieldValues> {
    className?: string
    title: string
    options: {
        title: string
        value?: unknown
        onChoice?: () => void
    }[]
    value?: unknown
    id?: Path<T>
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    disabled?: boolean
}

export default function Dropdown<T extends FieldValues>(props: DropdownProps<T>): ReactNode {
    const b = 'Dropdown'

    const { className, title, options, register, errors, disabled } = props

    let id = props.id
    let uniqId = useId()

    if (id == null) {
        id = uniqId as never
    }

    let registerProps = register ? { ...register(id!) } : {}

    const [isOpened, setOpened] = useState(false)

    const dropdownButtonRef = useRef<HTMLButtonElement>(null)
    const dropdownOptionsRef = useRef<HTMLDivElement>(null)

    const [value, setValue] = useState(props.value)

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    let currentOption!: DropdownProps<T>['options'][0]

    if (value != null) {
        currentOption = options.find(option => option.value === value)!
    }

    useEffect(() => {
        if (disabled) {
            return
        }

        function onClick(ev: MouseEvent | TouchEvent): void {
            let optionClick = false
            dropdownOptionsRef.current?.querySelectorAll(`.${b}-option-button`).forEach(option => {
                if (ev.target === option) {
                    optionClick = true
                }
            })

            if (
                !(ev.target as HTMLElement).contains(dropdownButtonRef.current) &&
                !(ev.target as HTMLElement).contains(dropdownOptionsRef.current) &&
                !optionClick
            ) {
                setOpened(false)
            }
        }

        window.addEventListener('mouseup', onClick)
        window.addEventListener('touchend', onClick)

        return (): void => {
            window.removeEventListener('mouseup', onClick)
            window.removeEventListener('touchend', onClick)
        }
    }, [disabled])

    return (
        <div className={cn('FormControl', b, className, { disabled })}>
            <Button
                ref={dropdownButtonRef}
                className={`${b}-dropdown-button UIGroupChild`}
                onClick={() => setOpened(isOpened => !isOpened)}
                disabled={disabled}
            >
                {currentOption ? currentOption.title : title}

                <i className={`${b}-dropdown-button-icon bi bi-caret-down`}></i>
            </Button>

            {isOpened && (
                <div
                    ref={dropdownOptionsRef}
                    className={`${b}-dropdown`}
                    {...registerProps}
                    id={id}
                >
                    {options.map((option, i) => (
                        <Button
                            className={`${b}-option-button`}
                            key={i}
                            onClick={() => {
                                setValue(option.value)
                                option.onChoice && option.onChoice()
                                setOpened(false)
                            }}
                        >
                            {option.title}
                        </Button>
                    ))}
                </div>
            )}

            {id && errors && errors[id] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id] && (errors[id]!.message as string)}
                </span>
            )}
        </div>
    )
}
