import { toCamelCase, toSnakeCase } from './string'

export const isObject = <Output extends object>(object: unknown): object is Output => {
  return !!object && object.constructor === Object && object instanceof Object
}

type ConverterType = (key: string) => string

export const mapObjectKeys = <Input, Output>(object: Input, converter: ConverterType): Output => {
  if (Array.isArray(object)) {
    return object.map((entry) => {
      return mapObjectKeys(entry, converter)
    }) as unknown as Output
  } else if (isObject<Record<string, unknown>>(object)) {
    return Object.keys(object).reduce<Record<string, unknown>>((newObject, key: string) => {
      const newKey = converter(key)
      newObject[newKey] = mapObjectKeys(object[key] as object | object[], converter)
      return newObject
    }, {}) as unknown as Output
  } else {
    return object as unknown as Output
  }
}

export const objectKeysToCamelCase = <T>(object: T) => {
  return mapObjectKeys(object, toCamelCase)
}

export const objectKeysToSnakeCase = <T>(object: T) => {
  return mapObjectKeys(object, toSnakeCase)
}

export const getIn = <OutputType, InputType>(object: InputType, path: Array<string | number>): OutputType => {
  if (path.length === 0) return object as unknown as OutputType
  return path.reduce<Record<string, any>>((result, entry) => {
    if (result == undefined) return undefined
    if (Array.isArray(result) && String(Number(entry)) === entry) {
      return result[Number(entry)]
    }
    return result[entry]
  }, object) as OutputType
}

const processChild = (field: string | number, fetchedPath: unknown, value: unknown) => {
  if (typeof field === 'number' && (Array.isArray(fetchedPath) || fetchedPath == undefined)) {
    const child = Array.from(Array.isArray(fetchedPath) ? fetchedPath : [])
    child[field] = value
    return child
  }
  const child = Object.freeze({ ...(isObject(fetchedPath) ? fetchedPath : {}), [field]: value })
  return child
}

export const setIn = <T>(object: T, path: Array<string | number>, value: unknown): T => {
  if (path.length === 0) return object
  if (path.length === 1) return { ...object, [path[0]]: value }

  const pathCopy = Array.from(path)
  let field = pathCopy.pop()
  let fetchedPath = getIn(object, pathCopy)
  let child

  child = processChild(field, fetchedPath, value)

  while (pathCopy.length > 0) {
    field = pathCopy.pop()
    fetchedPath = getIn(object, pathCopy)

    child = processChild(field, fetchedPath, child)
  }

  return child as T
}
