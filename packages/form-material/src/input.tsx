import React, { useRef } from 'react'
import TextField from '@mui/material/TextField'
import { useInputValidation } from '@datage/form-validation'

export const Input: typeof TextField = (props) => {
  const inputRef = useRef(null)
  const { valid, showErrors, errorMessage } = useInputValidation(inputRef)
  return (
    <TextField
      ref={inputRef}
      error={!!(showErrors && !valid && errorMessage)}
      helperText={showErrors && !valid && errorMessage}
      fullWidth
      type="text"
      {...props}
    />
  )
}

export default Input
