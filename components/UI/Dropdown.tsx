import cn from 'classnames'
import React from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import './Dropdown.scss'

export interface DropdownProps<T extends FieldValues> {
    id: Path<T>
    options: {
        title: string
        onChoice: () => void
    }[]
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    label?: string
}

export default function Dropdown<T extends FieldValues>(props: DropdownProps<T>): ReactNode {
    const b = 'Dropdown'

    const { id, options, register, errors, label } = props

    return (
        <div className={cn('FormControl', b)}>
            {label && (
                <label htmlFor={id} className={`${b}-label`}>
                    {label}
                </label>
            )}

            <div className={`${b}-dropdown`} {...register(id)} id={id}>
                {options.map((option, i) => (
                    <div className={`${b}-button`} key={i} onClick={() => option.onChoice()}>
                        {option.title}
                    </div>
                ))}
            </div>

            {errors[id] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id] && (errors[id].message as string)}
                </span>
            )}
        </div>
    )
}
