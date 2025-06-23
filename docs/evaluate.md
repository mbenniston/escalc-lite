
Expressions can be parsed and executed in one go with the `evaluate` function.

::: tip
When evaluating the same expression multiple times, it is always more performant to use `parse` to get the parsed
expression first then calling `execute` on with the expression. See [Parse & execute](./parse-and-execute.md) for more
details.
:::

## Example

```tsx
import { ESCalcLite } from "escalc-lite"

const result = ESCalcLite.evaluate('1 + 2')
console.log(result)
//3
```

## Parameters

Parameters are declared in expression in three potential ways:
- Writing out the parameter name as is e.g. x
- Wrapping the parameter name in square brackets e.g. [x]
- Wrapping the parameter name in braces e.g. {x}

Values for the parameters can be specified in the `evaluate` call in the second parameter, for example:

```tsx
import { ESCalcLite } from "escalc-lite"

const result = ESCalcLite.evaluate('1 + x', { params: { x: 100 }})
console.log(result)
//101
```

## Functions

Implementation for custom functions can be specified as the second argument to the `evaluate` call, for example:

```tsx
const plusOne: ESCalcLiteExpressionFunction = (args) => {
  const result = args[0].evaluate()
  if (typeof result !== 'number') {
    return null
  }
  return result + 1
}
const result = ESCalcLite.evaluate('PlusOne(10)', {
  functions: { PlusOne: plusOne },
})
console.log(result)
//11
```

## Lazy parameters

If a parameter needs to be calculated on demand it can be provided as a lazy parameter. When executing the expression
whenever the parameter is needed, its function is run to retrieve its value.

```tsx
import { ESCalcLite } from "escalc-lite"

const result = ESCalcLite.evaluate('1 + x', { lazyParams: { x: () => 100 }})
console.log(result)
//101
```

## Options

```ts
<!-- @include: ../src/evaluate.ts{14,25} -->
```

