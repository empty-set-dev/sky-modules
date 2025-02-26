import cn from 'classnames'
import React from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import './TextArea.scss'

export interface TextAreaProps<T extends FieldValues> {
    id: Path<T>
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    label?: string
    disabled?: boolean
    hidden?: boolean
}

export default function TextArea<T extends FieldValues>(props: TextAreaProps<T>): ReactNode {
    const b = 'TextArea'

    const { id, register, errors, label, disabled, hidden } = props

    return (
        <div className={cn('FormControl', b)}>
            {!hidden && label && (
                <label htmlFor={id} className={`${b}-label`}>
                    {label}
                </label>
            )}

            <textarea
                {...register(id)}
                id={id}
                className={`${b}-textarea`}
                aria-invalid={errors[id] ? 'true' : 'false'}
                disabled={disabled}
                hidden={hidden}
            />

            {!hidden && errors[id] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id] && (errors[id].message as string)}
                </span>
            )}
        </div>
    )
}
