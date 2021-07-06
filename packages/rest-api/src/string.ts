export const toCamelCase = (value: string) => {
  return value.replace(/(_\w)/g, (match) => match[1].toUpperCase())
}

export const toSnakeCase = (value: string) => {
  return value.replace(/([A-Z])/g, (match) => '_' + match.toLowerCase())
}
