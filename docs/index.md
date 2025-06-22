
# What is ESCalc Lite

ESCalc Lite is an opinionated [NCalc](https://ncalc.github.io/ncalc/) expression evaluator in TypeScript. It exposes a 
parser and a tree walk evaluator for a subset of the NCalc expression language.

::: tip
Just want to try it out? Skip to the [Getting started](./getting-started.md#demo).
:::

## What can it do?

ESCalc Lite can read and evaluate expressions like this:

```
if([score] > 1000, Pow([score], 0.5), [score] * 1.5) + Abs([delta])
```

```ts
import { ESCalcLite } from "escalc-lite";

const result = ESCalcLite.evaluate(
  'if([score] > 1000, Pow([score], 0.5), [score] * 1.5) + Abs([delta])',
  { params: { score: 196, delta: -221 } },
)
console.log(result)
// 515
```


