# `rest-api`

## Usage

### toSnakeCase
```
import { toSnakeCase } from '@yaks/rest-api'
const snaked = toSnakeCase('camelCase')
snaked === 'camel_case'
```

### toCamelCase
```
import { toSnakeCase } from '@yaks/rest-api'
const camel = toCamelCase('snake_case')
camel === 'snakeCase'
```

### isObject
```
import { isObject } from '@yaks/rest-api'
isObject(null)       // false
isObject(undefined)  // false
isObject(1)          // false
isObject('test')     // false
isObject(new Date()) // false
isObject([1])        // false
isObject({ a: 1 }})  // true
```

### mapObjectKeys
```
import { mapObjectKeys, toSnakeCase } from '@yaks/rest-api'
const camelObj = objectKeysToCamelCase({ snake_case: { more_snake_: [{ my_snake_: 1 }]}}, toSnakeCase)
console.log(camelObj) // { snakeCase: { moreSnake_: [{ mySnake_: 1 }]}}
```

### objectKeysToCamelCase
```
import { objectKeysToCamelCase } from '@yaks/rest-api'
const camelObj = objectKeysToCamelCase({ snake_case: { more_snake_: [{ my_snake_: 1 }]}})
console.log(camelObj) // { snakeCase: { moreSnake_: [{ mySnake_: 1 }]}}
```

### objectKeysToSnakeCase
```
import { objectKeysToSnakeCase } from '@yaks/rest-api'
const snakeObj = objectKeysToSnakeCase({ camelCase: { moreCamel: [{ myCamel: 1 }]}})
console.log(snakeObj) // { camel_case: { more_camel: [{ my_camel: 1 }]}}
```

### getIn
```
import { getIn } from '@yaks/rest-api'
const obj = { a: { b: { c: 1 } } }
const c = getIn(obj, 'a.b.c')
console.log(c) // 1
```

### setIn
```
import { setIn } from '@yaks/rest-api'
const obj = { a: { b: { c: 1 } } }
const obj1 = setIn(obj, 'a.b.d', 2)
console.log(obj1) // { a: { b: { c: 1, d: 2 } } }
```
