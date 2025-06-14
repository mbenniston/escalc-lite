import type { LogicalExpression } from './logical-expression'

export function evaluate(logicalExpression: LogicalExpression): number {
  switch (logicalExpression.type) {
    case 'unary':
      return -evaluate(logicalExpression.expression)
    case 'ternary': {
      const leftValue = evaluate(logicalExpression.left)
      return leftValue
        ? evaluate(logicalExpression.middle)
        : evaluate(logicalExpression.right)
    }
    case 'binary': {
      switch (logicalExpression.operator) {
        case 'subtraction':
          return (
            evaluate(logicalExpression.left) - evaluate(logicalExpression.right)
          )
        case 'addition':
          return (
            evaluate(logicalExpression.left) + evaluate(logicalExpression.right)
          )
        case 'multiplication':
          return (
            evaluate(logicalExpression.left) * evaluate(logicalExpression.right)
          )
        case 'division':
          return (
            evaluate(logicalExpression.left) / evaluate(logicalExpression.right)
          )
      }
    }
    case 'value':
      return logicalExpression.value
  }
}
