import { useCallback, ChangeEvent } from 'react'
import { setIn, getIn } from '@datage/rest-api'

export type UpdateDataType = <T>(data: T) => T

export const useInputProps = <T>(data: T, updateData: UpdateDataType) => {
  return useCallback(
    (pathString: string) => {
      const path = pathString.split('.')
      const value = String(getIn(data, path))
      const name = pathString
      const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          let newValue: boolean | string | null = null
          if (event.target.type === 'checkbox') {
            newValue = event.target.checked
          } else {
            newValue = event.target.value
          }

          if (newValue === 'true') {
            newValue = true
          } else if (newValue === 'false') {
            newValue = false
          }

          updateData((oldData: T) => {
            return setIn(oldData, path, newValue)
          })
        },
        [data, updateData, pathString]
      )
      return { path, value, name, onChange }
    },
    [data, updateData]
  )
}
