The required custom parameters and functions can be extracted from parsed expressions using the `parameters` function.

## Example

```tsx
import { ESCalcLite } from "escalc-lite"

const logicalExpression = ESCalcLite.parse("{x} + CustomFunc(1)")
const parameters = ESCalcLite.parameters(logicalExpression)
console.log(parameters)
// { parameters: [ 'x' ], functions: [ 'CustomFunc' ] }
```
