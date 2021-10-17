import { useCallback } from 'react'
import { setIn, getIn, splitPath } from '@datage/rest-api'
import type { ReactNode, ChangeEvent, Dispatch, SetStateAction } from 'react'

type HTMLInputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
export type GetterSetterValue =
  | string
  | number
  | boolean
  | Date
  | Record<string, unknown>
  | string[]
  | number[]
  | Date[]
  | Record<string, unknown>[]
  | File
  | File[]

export type GetterSetterOutput = string | number | boolean | File | File[]

export interface InputPropsOptionType {
  valueGetterHandler?: (value: GetterSetterValue) => string
  valueSetterHandler?: (value: GetterSetterOutput) => GetterSetterValue
}

export type InputEventType = <EventElement extends HTMLInputElements>(event: ChangeEvent<EventElement>) => void
export type SelectEventType = (
  event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
  child: ReactNode
) => void

export interface InputPropsOutputType<OnChangeType = InputEventType> {
  path: Array<string | number>
  value: string
  name: string
  onChange: OnChangeType
}
export type InputPropsType = (pathString: string, options?: InputPropsOptionType) => InputPropsOutputType
export interface InputPropsGlobalOptionType {
  setIn?: typeof setIn
}

export const useInputProps = <T>(
  data: T,
  updateData: Dispatch<SetStateAction<T>>,
  globalOptions?: InputPropsGlobalOptionType
): InputPropsType => {
  return useCallback(
    <EventElement extends HTMLInputElements>(pathString: string, options?: InputPropsOptionType) => {
      const { valueGetterHandler, valueSetterHandler } = options || {}
      const { setIn: wrappedSetIn } = globalOptions || { setIn }
      const path = splitPath(pathString)
      const orgValue = getIn(data, path) as GetterSetterValue
      const value =
        typeof valueGetterHandler === 'function'
          ? valueGetterHandler(orgValue)
          : String(orgValue == null ? '' : orgValue)
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
          return wrappedSetIn(
            oldData,
            path,
            typeof valueSetterHandler === 'function' ? valueSetterHandler(newValue) : newValue
          )
        }
        updateData(updater)
      }
      return { path, value, name, onChange }
    },
    [data, updateData]
  )
}
