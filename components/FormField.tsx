import React from 'react'
import { Input } from './ui/input'
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormFiledProps<T extends FieldValues> {
    control: Control<T>,
    name: Path<T>,
    label: string,
    placeholder?: string,
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ name, control, label, placeholder, type = "text" }: FormFiledProps<T>) => (
    <Controller name={name} control={control}
        render={({ field }) => (
            <FormItem>
                <FormLabel className='label'>{label}</FormLabel>
                <FormControl>
                    <Input className='input' placeholder={placeholder} {...field} type={type} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

export default FormField