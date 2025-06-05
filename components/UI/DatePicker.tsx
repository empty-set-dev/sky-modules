import cn from 'pkgs/classnames'
import { HTMLInputTypeAttribute } from 'react'
import React from 'react'
import ReactDatePicker from 'react-datepicker'
import {
    FieldValues,
    UseFormRegister,
    FieldErrors,
    Controller,
    Path,
    Control,
} from 'react-hook-form'

import 'react-datepicker/dist/react-datepicker.min.css'
import './DatePicker.scss'

export interface DatePickerProps<T extends FieldValues> {
    id?: Path<T>
    control?: Control<T>
    className?: string
    type?: HTMLInputTypeAttribute
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    label?: string
    value?: unknown
    disabled?: boolean
    hidden?: boolean
    accept?: string
}
export default function DatePicker<T extends FieldValues>(props: DatePickerProps<T>): ReactNode {
    const b = 'DatePicker'

    const { control, errors, label, hidden } = props

    let id = props.id
    let uniqId = useId()

    if (id == null) {
        id = uniqId as never
    }

    return (
        <div className={cn('FormControl', b, props.className)}>
            {!hidden && label && (
                <label htmlFor={id} className={`Label ${b}-label`}>
                    {label}
                </label>
            )}

            {control ? (
                <>
                    <Controller
                        control={control}
                        name={id}
                        render={({ field }) => (
                            <ReactDatePicker
                                onChange={date => field.onChange(date?.toISOString())}
                                selected={field.value ? new Date(field.value) : null}
                            />
                        )}
                    />
                </>
            ) : (
                <ReactDatePicker />
            )}

            {errors && !hidden && errors[id!] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id!] && (errors[id!]!.message as string)}
                </span>
            )}
        </div>
    )
}
