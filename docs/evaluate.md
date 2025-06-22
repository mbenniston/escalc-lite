
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

## Options

```ts
<!-- @include: ../src/evaluate.ts{8,14} -->
```

