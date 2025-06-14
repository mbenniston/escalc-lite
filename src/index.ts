import Decimal from 'decimal.js'
import type { LogicalExpression } from './logical-expression'
type ExpressionFunction = (
  args: LogicalExpression[],
  globalParameters?: Record<string, number>,
  expressionFunctions?: Record<string, ExpressionFunction>,
) => Decimal
export function evaluate(
  logicalExpression: LogicalExpression,
  expressionArguments?: Record<string, number>,
  expressionFunctions?: Record<string, ExpressionFunction>,
): Decimal {
  switch (logicalExpression.type) {
    case 'unary':
      return evaluate(logicalExpression.expression, expressionArguments).neg()
    case 'ternary': {
      const leftValue = evaluate(logicalExpression.left, expressionArguments)
      return leftValue
        ? evaluate(logicalExpression.middle, expressionArguments)
        : evaluate(logicalExpression.right, expressionArguments)
    }
    case 'binary': {
      const left = evaluate(logicalExpression.left, expressionArguments)
      const right = evaluate(logicalExpression.right, expressionArguments)

      switch (logicalExpression.operator) {
        case 'subtraction':
          return left.sub(right)
        case 'addition':
          return left.add(right)
        case 'multiplication':
          return left.mul(right)
        case 'division':
          return left.div(right)
      }
    }
    case 'function': {
      if (
        expressionFunctions &&
        logicalExpression.name in expressionFunctions
      ) {
        return expressionFunctions[logicalExpression.name](
          logicalExpression.arguments,
          expressionArguments,
          expressionFunctions,
        )
      }
      if (logicalExpression.name in builtIns) {
        return builtIns[logicalExpression.name](
          logicalExpression.arguments,
          expressionArguments,
          expressionFunctions,
        )
      }
      throw new Error(`Function ${logicalExpression.name} not supported`)
    }
    case 'value':
      switch (logicalExpression.value.type) {
        case 'constant':
          return new Decimal(logicalExpression.value.value)
        case 'parameter':
          {
            if (
              expressionArguments === undefined ||
              !(logicalExpression.value.name in expressionArguments)
            ) {
              throw new Error(
                `Parameter with name ${logicalExpression.value.name} not found`,
              )
            }
          }
          return new Decimal(expressionArguments[logicalExpression.value.name])
      }
  }
}

const builtIns: Record<string, ExpressionFunction> = {
  Sin: (args, globalParameters, functions) =>
    evaluate(args[0], globalParameters, functions).sin(),
}
