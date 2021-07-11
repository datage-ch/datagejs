import { useCallback, ChangeEvent } from 'react'
import { setIn, getIn } from '@datage/rest-api'

export type UpdateDataType = <T>(data: T) => T

export const useInputProps = <T>(data: T, updateData: UpdateDataType) => {
  return useCallback(
    (pathString: string) => {
      const path = pathString.split('.')
      const orgValue = getIn(data, path)
      const value = String(orgValue == null ? '' : orgValue)
      const name = pathString
      const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newValue: boolean | string | number | null = null
        if (event.target.type === 'checkbox') {
          newValue = event.target.checked
        } else if (event.target.type === 'number') {
          newValue = Number(event.target.value)
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
      }
      return { path, value, name, onChange }
    },
    [data, updateData]
  )
}
