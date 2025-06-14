import type { LogicalExpression } from './logical-expression'

export function evaluate(
  logicalExpression: LogicalExpression,
  expressionArguments?: Record<string, number>,
): number {
  switch (logicalExpression.type) {
    case 'unary':
      return -evaluate(logicalExpression.expression, expressionArguments)
    case 'ternary': {
      const leftValue = evaluate(logicalExpression.left, expressionArguments)
      return leftValue
        ? evaluate(logicalExpression.middle, expressionArguments)
        : evaluate(logicalExpression.right, expressionArguments)
    }
    case 'binary': {
      switch (logicalExpression.operator) {
        case 'subtraction':
          return (
            evaluate(logicalExpression.left, expressionArguments) -
            evaluate(logicalExpression.right, expressionArguments)
          )
        case 'addition':
          return (
            evaluate(logicalExpression.left, expressionArguments) +
            evaluate(logicalExpression.right, expressionArguments)
          )
        case 'multiplication':
          return (
            evaluate(logicalExpression.left, expressionArguments) *
            evaluate(logicalExpression.right, expressionArguments)
          )
        case 'division':
          return (
            evaluate(logicalExpression.left, expressionArguments) /
            evaluate(logicalExpression.right, expressionArguments)
          )
      }
    }
    case 'value':
      switch (logicalExpression.value.type) {
        case 'constant':
          return logicalExpression.value.value
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
          return expressionArguments[logicalExpression.value.name]
      }
  }
}
