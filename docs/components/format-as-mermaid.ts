import type {
  ESCalcLiteBinaryExpression,
  ESCalcLiteLogicalExpression,
  ESCalcLiteUnaryExpression,
} from '../../src'

export function formatAsMermaid(
  expression: ESCalcLiteLogicalExpression,
): string {
  return `graph TD\n${formatAsMermaidInner(expression, 'root')}\n`
}

function formatAsMermaidInner(
  expression: ESCalcLiteLogicalExpression,
  id: string,
): string {
  switch (expression.type) {
    case 'value':
      {
        switch (expression.value.type) {
          case 'constant':
            return `${id}[${JSON.stringify(expression.value.value)}]\n`
          case 'parameter':
            return `${id}["{${expression.value.name}}"]\n`
          case 'list': {
            const args = expression.value.items.map((arg, index) => {
              const argId = `${id}.${index}`
              const text = formatAsMermaidInner(arg, argId)
              return [argId, text]
            })

            const links = args
              .map((arg, index) => `${id}["(...)"] --> |${index}| ${arg[0]}\n`)
              .join('')
            const argDefs = args.map((arg) => String(arg[1])).join('')
            return links + argDefs
          }
        }
      }
      break
    case 'ternary':
      {
        const leftName = `${id}.left`
        const middleName = `${id}.middle`
        const rightName = `${id}.right`
        const left = formatAsMermaidInner(expression.left, leftName)
        const middle = formatAsMermaidInner(expression.middle, middleName)
        const right = formatAsMermaidInner(expression.right, rightName)
        return `${id}[?] --> ${middleName}\n${id}[?] --> ${rightName}\n${left}${middle}${right}`
      }
      break

    case 'binary':
      {
        const leftName = `${id}.left`
        const rightName = `${id}.right`
        const left = formatAsMermaidInner(expression.left, leftName)
        const right = formatAsMermaidInner(expression.right, rightName)
        const operatorStr = `"${prettyOperator(expression.operator)}"`
        return `${id}[${operatorStr}] --> ${leftName}\n${id}[${operatorStr}] --> ${rightName}\n${
          left
        }${right}`
      }
      break
    case 'unary':
      {
        const leftName = `${id}.1`
        const left = formatAsMermaidInner(expression.expression, leftName)
        const operatorStr = `"${prettyOperator(expression.operator)}"`
        return `${id}[${operatorStr}] --> ${leftName}\n\n${left}`
      }
      break
    case 'function':
      {
        const args = expression.arguments.map((arg, index) => {
          const argId = `${id}.${index}`
          const text = formatAsMermaidInner(arg, argId)
          return [argId, text]
        })

        const links = args
          .map(
            (arg, index) =>
              `${id}[${expression.name}] --> |${index}| ${arg[0]}\n`,
          )
          .join('')
        const argDefs = args.map((arg) => String(arg[1])).join('')
        return links + argDefs
      }
      break
  }
}
const prettyOperator = (
  o:
    | ESCalcLiteBinaryExpression['operator']
    | ESCalcLiteUnaryExpression['operator'],
): string => {
  switch (o) {
    case 'not':
      return '!'
    case 'bit-complement':
      return '~'
    case 'negate':
      return '-'
    case 'subtraction':
      return String.raw`\-`
    case 'addition':
      return String.raw`\+`
    case 'multiplication':
      return String.raw`\*`
    case 'division':
      return '/'
    case 'modulus':
      return '%'
    case 'exponentiation':
      return '**'
    case 'more-than':
      return String.raw`\>`
    case 'less-than':
      return '<'
    case 'more-than-equal':
      return String.raw`\>=`
    case 'less-than-equal':
      return '<='
    case 'not-equals':
      return '!='
    case 'equals':
      return '='
    case 'and':
      return 'and'
    case 'or':
      return 'or'
    case 'bit-and':
      return 'bitwise and'
    case 'bit-or':
      return 'bitwise or'
    case 'bit-xor':
      return 'bitwise xor'
    case 'bit-left-shift':
      return 'left shift'
    case 'bit-right-shift':
      return 'right shift'
    case 'in':
      return 'in'
    case 'not-in':
      return 'not in'
  }
}
