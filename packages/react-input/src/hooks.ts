import { useCallback, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { setIn, getIn } from '@datage/rest-api'

type HTMLInputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type InputPropsOutputType = {
  path: string[]
  value: string
  name: string
  onChange: <EventElement extends HTMLInputElements>(event: ChangeEvent<EventElement>) => void
}
export type InputPropsType = (pathString: string) => InputPropsOutputType

export const useInputProps = <T>(data: T, updateData: Dispatch<SetStateAction<T>>): InputPropsType => {
  return useCallback(
    <EventElement extends HTMLInputElements>(pathString: string) => {
      const path = pathString.split('.')
      const orgValue = getIn(data, path)
      const value = String(orgValue == null ? '' : orgValue)
      const name = pathString
      const onChange = (event: ChangeEvent<EventElement>) => {
        let newValue: boolean | string | number | File | File[] | null = null
        if (event.target instanceof HTMLInputElement) {
          if (event.target.type === 'checkbox') {
            const input = event.target
            newValue = event.target.checked
          } else if (event.target.type === 'number') {
            newValue = Number(event.target.value)
          } else if (event.target.type === 'file') {
            if (event.target.multiple) {
              const files: File[] = []
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
        } else if (event.target instanceof HTMLSelectElement) {
          newValue = event.target.value
        } else if (event.target instanceof HTMLTextAreaElement) {
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
