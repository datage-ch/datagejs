import { useCallback, ChangeEvent } from 'react'
import { setIn, getIn } from '@yaks/rest-api'

export type UpdateDataType = <T>(data: T) => T

export const useInputProps = <T>(data: T, updateData: UpdateDataType) => {
  return useCallback(
    (pathString: string) => {
      const path = pathString.split('.')
      const value = getIn(data, path)
      const name = pathString
      const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          let value: boolean | string | null = null
          if (event.currentTarget.type === 'checkbox') {
            value = event.currentTarget.checked
          } else {
            value = event.currentTarget.value
          }

          updateData((oldData: T) => {
            return setIn(oldData, path, value)
          })
        },
        [data, updateData, pathString]
      )
      return { path, value, name, onChange }
    },
    [data, updateData]
  )
}