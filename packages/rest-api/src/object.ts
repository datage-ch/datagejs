import { toCamelCase, toSnakeCase } from './string'

export const isObject = (object: any): boolean => {
  return !!object && object.constructor === Object && object instanceof Object
}

type ConverterType = (key: string) => string
type MapObjectKeysType<T> = (object: T, converter: ConverterType) => T
type MapObjectKeysFNType<T> = (object: T) => T

export const mapObjectKeys = <T>(object: T, converter: ConverterType): T => {
  if (Array.isArray(object)) {
    return object.map((entry) => {
      return mapObjectKeys(entry, converter)
    }) as any as T
  } else if (isObject(object)) {
    const asObject = object as Record<string, any>
    return Object.keys(asObject).reduce<Record<string, any>>((newObject, key: string) => {
      const newKey = converter(key)
      newObject[newKey] = mapObjectKeys(asObject[key] as any, converter)
      return newObject
    }, {}) as T
  } else {
    return object
  }
}

export const objectKeysToCamelCase = <T>(object: T) => {
  return mapObjectKeys(object, toCamelCase)
}

export const objectKeysToSnakeCase = <T>(object: T) => {
  return mapObjectKeys(object, toSnakeCase)
}

export const getIn = <
  OutputType extends Record<string, any> | Record<string, any>[] | undefined,
  InputType extends Record<string, any> | Record<string, any>[] | undefined
>(
  object: InputType,
  path: Array<string | number>
): OutputType => {
  if (path.length === 0) return object as unknown as OutputType
  return path.reduce<Record<string, any>>((result, entry) => {
    if (result == undefined) return undefined
    if (Array.isArray(result) && String(Number(entry)) === entry) {
      return result[Number(entry)]
    }
    return result[entry]
  }, object) as OutputType
}

const processChild = (field: string | number, fetchedPath: any, value: any) => {
  let child
  if (typeof field === 'number' && (Array.isArray(fetchedPath) || fetchedPath == undefined)) {
    child = Array.from(fetchedPath || [])
    child[field] = value
  } else {
    child = Object.freeze({ ...(fetchedPath || {}), [field]: value })
  }
  return child
}

export const setIn = <T extends Record<string, any>>(object: T, path: Array<string | number>, value: any): T => {
  if (path.length === 0) return object
  if (path.length === 1) return { ...object, [path[0]]: value }

  const pathCopy = Array.from(path)
  let field = pathCopy.pop()
  let fetchedPath = getIn(object, pathCopy) as any
  let child

  child = processChild(field, fetchedPath, value)

  while (pathCopy.length > 0) {
    field = pathCopy.pop()
    fetchedPath = getIn(object, pathCopy)

    child = processChild(field, fetchedPath, child)
  }

  return child as T
}
