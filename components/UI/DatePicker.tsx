import { HTMLInputTypeAttribute } from "react"
import { FieldValues, UseFormRegister, FieldErrors, Controller, Path, Control } from "react-hook-form"
import ReactDatePicker from "react-datepicker"
import React from "react"
import cn from "classnames"
import "./DatePicker.scss"

export interface DatePickerProps<T extends FieldValues> {
    id: Path<T>
    control: Control<T>
    className?: string
    type?: HTMLInputTypeAttribute
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    label?: string
    value?: unknown
    disabled?: boolean
    hidden?: boolean
    accept?: string
}

export default function DatePicker<T extends FieldValues>(props: DatePickerProps<T>) {
    const b = "DatePicker"

    const { id, control, type, register, errors, label, value, disabled, hidden, accept } = props

    return (
        <div className={cn("FormControl", b, props.className)}>
            {!hidden && label && (
                <label htmlFor={id} className={`${b}-label`}>
                    {label}
                </label>
            )}

            <Controller
                control={control}
                name={id}
                render={({ field }) => (
                    <ReactDatePicker
                        onChange={(date) => field.onChange(date?.toISOString())}
                        selected={field.value ? new Date(field.value) : null}
                    />
                )}
            />

            {!hidden && errors[id] && (
                <span role="alert" className={`ErrorMessage ${b}-errors`}>
                    {errors[id] && (errors[id].message as string)}
                </span>
            )}
        </div>
    )
}
