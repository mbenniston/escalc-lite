### Demo

You can try EScalc in the docs in the [Demo](./demo.md) page.

## Installation 

::: code-group

```bash [npm]
npm install escalc-lite
```

```bash [yarn]
yarn add escalc-lite
```

```bash [pnpm]
pnpm add escalc-lite
```

```bash [bun]
bun add escalc-lite
```

:::

## Evaluating an expression

```tsx
import { ESCalcLite } from "escalc-lite"

const result = ESCalcLite.evaluate('1 + 2')
console.log(result)
//3
```

## Parsing an expression

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
```

## Formatting an expression

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
```
