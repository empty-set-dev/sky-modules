import cn from 'classnames'
import React from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import './TextArea.scss'

export interface TextAreaProps<T extends FieldValues> {
    id?: Path<T>
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    label?: string
    disabled?: boolean
    hidden?: boolean
}

export default function TextArea<T extends FieldValues>(props: TextAreaProps<T>): ReactNode {
    const b = 'TextArea'

    const { register, errors, label, disabled, hidden } = props

    let id = props.id
    let uniqId = useId()

    if (id == null) {
        id = uniqId as never
    }

    const registerFields = register ? { ...register(id!) } : {}

    return (
        <div className={cn('FormControl', b)}>
            {!hidden && label && (
                <label htmlFor={id} className={`${b}-label`}>
                    {label}
                </label>
            )}

            <textarea
                {...registerFields}
                id={id}
                className={`${b}-textarea`}
                aria-invalid={errors && errors[id!] ? 'true' : 'false'}
                disabled={disabled}
                hidden={hidden}
            />

            {errors && !hidden && errors[id!] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id!] && (errors[id!]!.message as string)}
                </span>
            )}
        </div>
    )
}
