import { useCallback, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { setIn, getIn } from '@datage/rest-api'

export const useInputProps = <T>(data: T, updateData: Dispatch<SetStateAction<T>>) => {
  return useCallback(
    (pathString: string) => {
      const path = pathString.split('.')
      const orgValue = getIn(data, path)
      const value = String(orgValue == null ? '' : orgValue)
      const name = pathString
      const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newValue: boolean | string | number | Blob | Blob[] | null = null
        if (event.target.type === 'checkbox') {
          newValue = event.target.checked
        } else if (event.target.type === 'number') {
          newValue = Number(event.target.value)
        } else if (event.target.type === 'file') {
          if (event.target.multiple) {
            const files = []
            for (var i = 0; i < event.target.files.length; i++) {
              files.push(event.target.files.item(i))
            }
            newValue = files
          } else {
            newValue = event.target.files.item(0)
          }
        } else {
          newValue = event.target.value
        }

        if (newValue === 'true') {
          newValue = true
        } else if (newValue === 'false') {
          newValue = false
        }

        const updater: SetStateAction<any> = (oldData: any) => {
          return setIn(oldData, path, newValue)
        }
        updateData(updater)
      }
      return { path, value, name, onChange }
    },
    [data, updateData]
  )
}
