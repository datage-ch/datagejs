import { useEffect, useState, useCallback, useContext, useRef, MutableRefObject } from 'react'
import { ValidationContext } from './form'

const usePrevious = (value: any) => {
  const ref = useRef<any>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export type UseInputValidationReturn = {
  valid: boolean
  errorMessage: string | undefined
  errors: Record<string, string>
  showErrors: boolean
}

export const useInputValidation = (inputRef: MutableRefObject<null | HTMLInputElement>): UseInputValidationReturn => {
  const [valid, setValid] = useState(true)
  const { errors, setErrors, showErrors } = useContext(ValidationContext)
  const eventListener = useCallback(
    (event) => {
      event.preventDefault()
      setValid(event.target.validity.valid)
      const errorMessage = inputRef?.current?.dataset?.errorMessage
      if (errorMessage && setErrors) {
        setErrors((errors) => {
          const name = inputRef.current?.name
          if (name) {
            return { ...errors, [name]: errorMessage }
          }
          return errors
        })
      }
    },
    [inputRef.current]
  )
  const previousRef = usePrevious(inputRef.current) as HTMLInputElement | null
  const previousEventListener = usePrevious(eventListener) as typeof eventListener
  useEffect(() => {
    if (previousRef && previousEventListener && eventListener !== previousEventListener) {
      previousRef.removeEventListener('invalid', previousEventListener)
    }
    if (inputRef.current) {
      inputRef.current.addEventListener('invalid', eventListener)
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('invalid', eventListener)
      }
    }
  }, [inputRef.current])
  useEffect(() => {
    if (inputRef?.current && showErrors) {
      if (!valid && inputRef?.current?.validity?.valid) {
        setValid(true)
        if (errors[inputRef.current.name] && setErrors) {
          setErrors((errors) => {
            const name = inputRef.current?.name
            const copy = { ...errors }
            if (name) delete copy[name]
            return copy
          })
        }
      }
      inputRef.current.checkValidity()
    }
  }, [showErrors, valid, inputRef?.current?.validity?.valid])
  return { valid, errorMessage: inputRef?.current?.dataset?.errorMessage, errors, showErrors }
}
