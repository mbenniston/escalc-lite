import { builtIns } from '../evaluator/tree-walker'
import type { LogicalExpression } from './logical-expression'

const builtinFunctionNames = new Set(Object.keys(builtIns))

export function collectParameters(expression: LogicalExpression): {
  parameters: Set<string>
  functions: Set<string>
} {
  const parameters = new Set<string>()
  const functions = new Set<string>()
  collect(expression, { parameters, functions })
  return { parameters, functions }
}

function collect(
  expression: LogicalExpression,
  outputs: { parameters: Set<string>; functions: Set<string> },
): void {
  switch (expression.type) {
    case 'value':
      {
        if (expression.value.type === 'parameter') {
          outputs.parameters.add(expression.value.name)
        }
      }
      break
    case 'ternary':
      collect(expression.left, outputs)
      collect(expression.middle, outputs)
      collect(expression.right, outputs)
      break
    case 'binary':
      collect(expression.left, outputs)
      collect(expression.right, outputs)
      break
    case 'unary':
      collect(expression.expression, outputs)
      break
    case 'function':
      expression.arguments.forEach((arg) => {
        collect(arg, outputs)
      })

      if (!builtinFunctionNames.has(expression.name))
        outputs.functions.add(expression.name)
      break
  }
}
