import { ESCalcLiteBuiltIns } from './execute'
import type { ESCalcLiteLogicalExpression } from './parse'

export function parameters(expression: ESCalcLiteLogicalExpression): {
  parameters: string[]
  functions: string[]
} {
  const { parameters, functions } = collectParameters(expression)
  return { parameters: [...parameters], functions: [...functions] }
}

export function parametersSafe(
  expression: ESCalcLiteLogicalExpression,
):
  | { type: 'success'; result: ReturnType<typeof parameters> }
  | { type: 'error'; error: unknown } {
  try {
    return { type: 'success', result: parameters(expression) }
  } catch (error) {
    return { type: 'error', error }
  }
}

const builtinFunctionNames = new Set(Object.keys(ESCalcLiteBuiltIns))

export function collectParameters(expression: ESCalcLiteLogicalExpression): {
  parameters: Set<string>
  functions: Set<string>
} {
  const parameters = new Set<string>()
  const functions = new Set<string>()
  collect(expression, { parameters, functions })
  return { parameters, functions }
}

function collect(
  expression: ESCalcLiteLogicalExpression,
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
