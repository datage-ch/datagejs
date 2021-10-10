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

export const getIn = <T>(object: T, path: Array<string | number>) => {
  if (path.length === 0) return object
  return path.reduce<Record<string, any>>((result, entry) => {
    if (result == undefined) return undefined
    if (Array.isArray(result) && String(Number(entry)) === entry) {
      return result[Number(entry)]
    }
    return result[entry]
  }, object)
}

export const setIn = <T extends Record<string, any>>(object: T, path: Array<string | number>, value: any): T => {
  if (path.length === 0) return object
  if (path.length === 1) return { ...object, [path[0]]: value }

  const pathCopy = Array.from(path)
  let field = pathCopy.pop()
  let fetchedPath = getIn(object, pathCopy)
  let child

  if (typeof field === 'number' && Array.isArray(fetchedPath)) {
    child = Array.from(fetchedPath)
    child[field] = value
  } else {
    child = Object.freeze({ ...fetchedPath, [field]: value })
  }

  while (pathCopy.length > 0) {
    field = pathCopy.pop()
    fetchedPath = getIn(object, pathCopy)

    if (typeof field === 'number' && Array.isArray(fetchedPath)) {
      let tmp = Array.from(fetchedPath)
      tmp[field] = child
      child = tmp
    } else {
      child = Object.freeze({ ...fetchedPath, [field]: child })
    }
  }

  return child as T
}
