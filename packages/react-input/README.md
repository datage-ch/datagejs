# `@datage/react-input`

## Usage

### useInputProps
add a value and a onChange handler to inputs

returns an object with this props:
 - path
 - value
 - name
 - onChange
```
import { useInputProps } from '@datage/react-input'

const [data, updateData] = useState({})
const inputProps = useInputProps(data, updateData)

<input type="text" {...inputProps('name')} />
```
