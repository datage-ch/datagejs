import React, { useRef, ComponentProps, ReactNode, FC } from 'react'
import { TextField } from '@material-ui/core'
import { useInputValidation } from '@datage/form-validation'

export type SelectProps = ComponentProps<typeof TextField> & {
  options: { value: number | string; label?: ReactNode }[]
  hasEmpty?: boolean
  hasEmptyLabel?: string
}

export const Select: FC<SelectProps> = (props) => {
  const { options, hasEmpty, hasEmptyLabel, ...selectProps } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { valid, showErrors, errorMessage } = useInputValidation(inputRef)
  return (
    <>
      <TextField
        select
        inputRef={inputRef}
        SelectProps={{
          native: true,
        }}
        error={!!(showErrors && !valid)}
        fullWidth
        {...selectProps}
      >
        {hasEmpty && <option>{hasEmptyLabel}</option>}
        {options.map((option, index) => {
          return (
            <option value={option.value} key={option.value || `index-${index}`}>
              {option.label || option.value}
            </option>
          )
        })}
      </TextField>
      {showErrors && !valid && errorMessage}
    </>
  )
}

export default Select
