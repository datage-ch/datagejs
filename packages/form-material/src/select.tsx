import React, { useRef, ComponentProps, ReactNode, FC } from 'react'
import { NativeSelect } from '@material-ui/core'
import { useInputValidation } from '@datage/form-validation'

interface SelectProps extends ComponentProps<typeof NativeSelect> {
  options: { value: number | string; label?: ReactNode }[]
}

export const Select: FC<SelectProps> = (props) => {
  const { options, ...selectProps } = props
  const inputRef = useRef(null)
  const { valid, showErrors, errorMessage } = useInputValidation(inputRef)
  return (
    <>
      <NativeSelect
        ref={inputRef}
        variant="outlined"
        margin="none"
        error={!!(showErrors && !valid)}
        fullWidth
        {...selectProps}
      >
        {options.map((option, index) => {
          return (
            <option value={option.value} key={option.value || `index-${index}`}>
              {option.label || option.value}
            </option>
          )
        })}
      </NativeSelect>
      {showErrors && !valid && errorMessage}
    </>
  )
}

export default Select
