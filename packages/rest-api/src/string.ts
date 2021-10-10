export const toCamelCase = (value: string) => {
  return value.replace(/(_\w)/g, (match) => match[1].toUpperCase())
}

export const toSnakeCase = (value: string) => {
  return value.replace(/([A-Z])/g, (match) => '_' + match.toLowerCase())
}

export const splitPath = (path: string): Array<number | string> => {
  return path.split('.').map((part) => {
    if (String(Number(part)) === part) return Number(part)
    return part
  })
}
