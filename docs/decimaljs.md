
The default numeric type used for evaluation can be replaced a custom one if more accuracy is required.
For example to replace the numeric type with a decimal.js `Decimal` two overrides must be applied:

## Overriding the literal factory

First the literal factory must be overridden to produce `Decimal` instances instead of JavaScript numbers.

```ts

class DecimalLiteralFactory extends ESCalcLiteDefaultLiteralFactory {
  create(type: ESCalcLiteLiteralTokenType, value: string): unknown {
    if (type === 'number') {
      return new Decimal(value)
    }
    return super.create(type, value)
  }
}

```

## Overriding the value calculator

Next the value calculator must be overridden to handle `Decimal` instances by calling their methods if present.

```ts

class DecimalCalculator extends DefaultValueCalculator {
  add(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (leftValue instanceof Decimal && rightValue instanceof Decimal) {
      return leftValue.add(rightValue)
    }
    return super.add(left, right)
  }
  //...
}
```
