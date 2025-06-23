
Expressions can be parsed and executed in separately with the `parse` and `execute` functions. This is more
efficient that calling `evaluate` multiple times with the same expression because the `parse` step only needs to
be done once per expression.

## Example

```tsx
import { ESCalcLite } from "escalc-lite"

const logicalExpression = ESCalcLite.parse('1 + 2')
console.log(logicalExpression)
/*
{
  type: 'binary',
  operator: 'addition',
  left: { type: 'value', value: { type: 'constant', value: 1 } },
  right: { type: 'value', value: { type: 'constant', value: 2 } }
}
*/

const result = ESCalcLite.execute(logicalExpression)
console.log(result)
//3
```

## Options

### Parse

```ts
<!-- @include: ../src/parse.ts{3,6} -->
```

### Execute

```ts
<!-- @include: ../src/execute.ts{5,14} -->
```
