import React, { createContext, memo, useCallback, useState, SyntheticEvent, FC, HTMLProps } from 'react'

export const ValidationContext = createContext<{
  showErrors: boolean
  setShowErrors?: React.Dispatch<React.SetStateAction<boolean>>
  errors: Record<string, string>
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}>({
  showErrors: false,
  errors: {},
})

export type UseValidationProps = {
  onValid?: (form: HTMLFormElement) => void
  onInvalid?: (form: HTMLFormElement) => void
  cancelEvent?: boolean
  setShowErrors: (state: boolean) => void
}
export type UseValidationReturn = (event: SyntheticEvent<HTMLFormElement>) => void

export const useValidation = ({
  onValid,
  onInvalid,
  cancelEvent = true,
  setShowErrors,
}: UseValidationProps): UseValidationReturn => {
  return useCallback(
    (event) => {
      if (event.currentTarget?.validity?.valid === false) {
        setShowErrors(true)
        if (typeof onInvalid === 'function') onInvalid(event.currentTarget)
        event.preventDefault()
      } else {
        setShowErrors(false)
        if (typeof onValid === 'function') onValid(event.currentTarget)
        if (cancelEvent) event.preventDefault()
      }
    },
    [onValid, onInvalid, cancelEvent, setShowErrors]
  )
}

export type ValidationFormProps = HTMLProps<HTMLFormElement> & {
  onValid?: (form: HTMLFormElement) => void
  onInvalid?: (form: HTMLFormElement) => void
}

export const ValidationForm: FC<ValidationFormProps> = memo(({ children, onValid, onInvalid, ...formProps }) => {
  const [showErrors, setShowErrors] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submitHandler = useValidation({ onValid, onInvalid, setShowErrors })
  return (
    <ValidationContext.Provider value={{ showErrors, setShowErrors, errors, setErrors }}>
      <form {...formProps} onSubmit={submitHandler} onInvalid={submitHandler}>
        {children}
      </form>
    </ValidationContext.Provider>
  )
})
ValidationForm.displayName = 'ValidationForm'
