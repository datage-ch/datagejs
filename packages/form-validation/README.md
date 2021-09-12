# `@datage/form-validation`

## Usage

### useValidation
create an handler to listen to form changes (submit/invalid)
 - onValid: (event: HTMLFormElement) => void
 - onInvalid: (event: HTMLFormElement) => void
 - cancelEvent: boolean = true
 - setShowErrors: (state: boolean) => void
```
import { useValidation } from '@datage/form-validation'

const submitHandler = useValidation({ onValid, onInvalid })

<form onSubmit={onValid} onInvalid={submitHandler}>
  {children}
</form>
```


### useInputValidation
add an listener on the input element for the validations
```
import { useInputValidation } from '@datage/form-validation'

const inputRef = useRef()
const { valid, errorMessage, errors, showErrors } = useInputValidation(inputRef)

<input type="text" {...inputProps('name')} ref={inputRef} />
```


### ValidationForm
creates a form element wrapped in a react context. add an easy validation on input elements through HTML validations.
```
import { ValidationForm } from '@datage/form-validation'

const onValidHandler = (form: HTMLFormElement) => {
  ...
}

const onInvalidHandler = (form: HTMLFormElement) => {
  ...
}

<ValidationForm onValid={onValidHandler} onInvalid={onInvalidHandler}>
  <input ... required data-error-message="my-custom-error-message" />
  <input ... required data-error-message="my custom error message" />
</ValidationForm>
```

