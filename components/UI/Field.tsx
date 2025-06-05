import cn from 'pkgs/classnames'
import React, { HTMLInputTypeAttribute } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

import './Field.scss'

export interface FieldProps<T extends FieldValues> {
    id?: Path<T>
    className?: string
    type?: HTMLInputTypeAttribute
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    label?: string
    value?: unknown
    disabled?: boolean
    hidden?: boolean
    accept?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function Field<T extends FieldValues>(props: FieldProps<T>): ReactNode {
    const b = 'Field'

    const { type, register, errors, label, value, disabled, hidden, accept } = props

    let id = props.id
    let uniqId = useId()

    if (id == null) {
        id = uniqId as never
    }

    const registerFields = register ? { ...register(id!) } : {}

    return (
        <div className={cn('FormControl', b, props.className)}>
            {!hidden && label && (
                <label htmlFor={id} className={`Label`}>
                    {label}
                </label>
            )}

            <input
                type={type || 'text'}
                {...registerFields}
                id={id}
                className={`${b}-input`}
                aria-invalid={errors ? !!errors[id!] : false}
                disabled={disabled}
                hidden={hidden}
                accept={accept}
                value={value as never}
                onChange={props.onChange}
            />

            {!hidden && errors && errors[id!] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id!] && (errors[id!]!.message as string)}
                </span>
            )}
        </div>
    )
}
