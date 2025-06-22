import type { ESCalcLiteLogicalExpression } from './parse'

export function format(expression: ESCalcLiteLogicalExpression): string {
  return formatter(expression)
}

export function formatSafe(
  expression: ESCalcLiteLogicalExpression,
): { type: 'success'; result: string } | { type: 'error'; error: unknown } {
  try {
    return { type: 'success', result: format(expression) }
  } catch (error) {
    return { type: 'error', error }
  }
}

function formatter(expression: ESCalcLiteLogicalExpression): string {
  switch (expression.type) {
    case 'value':
      {
        switch (expression.value.type) {
          case 'list':
            return expression.value.items
              .map((item) => formatter(item))
              .join(',')
          case 'constant':
            return String(expression.value.value)
          case 'parameter': {
            return `[${expression.value.name}]`
          }
        }
      }
      break
    case 'ternary':
      {
        const leftParam = formatter(expression.left)
        const middleParam = formatter(expression.middle)
        const rightParam = formatter(expression.right)

        return `${leftParam} ? ${middleParam} : ${rightParam}`
      }
      break
    case 'binary':
      {
        const leftParam = formatter(expression.left)
        const rightParam = formatter(expression.right)

        switch (expression.operator) {
          case 'modulus':
            return `${leftParam} % ${rightParam}`
          case 'exponentiation':
            return `${leftParam} ** ${rightParam}`
          case 'in':
            return `${leftParam} in ${rightParam}`
          case 'not-in':
            return `${leftParam} not in ${rightParam}`
          case 'subtraction':
            return `${leftParam} - ${rightParam}`
          case 'addition':
            return `${leftParam} + ${rightParam}`
          case 'multiplication':
            return `${leftParam} * ${rightParam}`
          case 'division':
            return `${leftParam} / ${rightParam}`
          case 'more-than':
            return `${leftParam} > ${rightParam}`
          case 'less-than':
            return `${leftParam} < ${rightParam}`
          case 'more-than-equal':
            return `${leftParam} >= ${rightParam}`
          case 'less-than-equal':
            return `${leftParam} <= ${rightParam}`
          case 'not-equals':
            return `${leftParam} != ${rightParam}`
          case 'equals':
            return `${leftParam} == ${rightParam}`
          case 'and':
            return `${leftParam} && ${rightParam}`
          case 'or':
            return `${leftParam} || ${rightParam}`
          case 'bit-and':
            return `${leftParam} & ${rightParam}`
          case 'bit-or':
            return `${leftParam} | ${rightParam}`
          case 'bit-xor':
            return `${leftParam} ^ ${rightParam}`
          case 'bit-left-shift':
            return `${leftParam} << ${rightParam}`
          case 'bit-right-shift':
            return `${leftParam} >> ${rightParam}`
        }
      }
      break
    case 'unary':
      {
        const param = formatter(expression.expression)

        switch (expression.operator) {
          case 'not':
            return `~${param}`
          case 'bit-complement':
            return `~${param}`
          case 'negate':
            return `-${param}`
        }
      }
      break
    case 'function': {
      return `${expression.name}(${expression.arguments.map(formatter).join(',')})`
    }
  }

  throw new Error(`unhandled expression ${JSON.stringify(expression)}`)
}
