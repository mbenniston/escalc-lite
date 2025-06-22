Parsed expressions can be converted back into string expressions using the `format` function.

## Example

```tsx
import { ESCalcLite } from "escalc-lite"

const logicalExpression = ESCalcLite.parse('1 + 2')
const result = ESCalcLite.format(logicalExpression)
console.log(result)
//1 + 2
```
