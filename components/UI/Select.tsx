import cn from 'pkgs/classnames'
import React from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import * as styles from './Select.scss'

styles

export interface SelectProps<T extends FieldValues> {
    id?: Path<T>
    options: {
        title: ReactNode
        value: string
    }[]
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    label?: string
    disabled?: boolean
}

export default function Select<T extends FieldValues>(props: SelectProps<T>): ReactNode {
    const b = 'Select'

    const { id, options, register, errors, label, disabled } = props

    const selectProps: Record<string, unknown> = { id, disabled }

    if (register) {
        Object.assign(selectProps, register(id!))
    }

    return (
        <div className={cn('FormControl', b, { disabled })}>
            {label && (
                <label htmlFor={id} className={`${b}-label`}>
                    {label}
                </label>
            )}

            <select className={`${b}-select UIGroupChild`} {...selectProps}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.title}
                    </option>
                ))}
            </select>
            <i className={`${b}-select-icon bi bi-caret-down`}></i>

            {errors && errors[id!] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id!] && (errors[id!]!.message as string)}
                </span>
            )}
        </div>
    )
}
