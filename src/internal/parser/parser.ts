import { BufferedStream } from '../stream/buffered-stream'
import { CharacterStream } from '../stream/character-stream'
import { Tokenizer } from '../tokenizer/tokenizer'
import { SemanticError } from './errors/semantic-error'
import { UnexpectedTokenError } from './errors/unexpected-token-error'
import { DefaultLiteralFactory, type LiteralFactory } from './literal-factory'
import { match, matchOperators, matchOrThrow, type Scanner } from './utils'
import type {
  BinaryExpression,
  LogicalExpression,
  UnaryExpression,
} from './logical-expression'

const defaultLiteralFactory = new DefaultLiteralFactory()

export function parse(
  expression: string,
  literalFactory: LiteralFactory = defaultLiteralFactory,
): LogicalExpression {
  const scanner = new BufferedStream(
    new Tokenizer(new BufferedStream(new CharacterStream(expression))),
  )

  return logicalExpression(scanner, literalFactory)
}

function logicalExpression(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  return ternary(scanner, literalFactory)
}

function ternary(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = or(scanner, literalFactory)

  while (true) {
    const matchedOperator = matchOperators(scanner, ['?'])

    if (matchedOperator !== null) {
      const middle = or(scanner, literalFactory)

      matchOrThrow(scanner, 'colon')

      const right = or(scanner, literalFactory)

      left = { type: 'ternary', left, middle, right }
    } else {
      return left
    }
  }
}

function or(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = and(scanner, literalFactory)

  const operators = ['||']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '||': 'or',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = and(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}
function and(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = comparison(scanner, literalFactory)

  const operators = ['&&']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '&&': 'and',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = comparison(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function comparison(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = bitOr(scanner, literalFactory)

  const operators = ['>', '<', '<=', '>=', '!=', '==', '=', '<>']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '>': 'more-than',
    '<': 'less-than',
    '<=': 'less-than-equal',
    '>=': 'more-than-equal',
    '!=': 'not-equals',
    '<>': 'not-equals',
    '==': 'equals',
    '=': 'equals',
  } as const

  while (true) {
    if (matchOperators(scanner, ['not'])) {
      if (matchOrThrow(scanner, 'operator').operator !== 'in') {
        throw new SemanticError('Expected "in" after "not"')
      }

      const items = bitOr(scanner, literalFactory)
      return { type: 'binary', operator: 'not-in', left, right: items }
    }
    if (matchOperators(scanner, ['in'])) {
      const items = bitOr(scanner, literalFactory)
      return { type: 'binary', operator: 'in', left, right: items }
    }

    const matchedOperator = matchOperators(scanner, operators)

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitOr(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitOr(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = bitXor(scanner, literalFactory)

  const operators = ['|']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '|': 'bit-or',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitXor(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitXor(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = bitAnd(scanner, literalFactory)

  const operators = ['^']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '^': 'bit-xor',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitAnd(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitAnd(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = bitShift(scanner, literalFactory)

  const operators = ['&']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '&': 'bit-and',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators) ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitShift(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitShift(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = additive(scanner, literalFactory)

  const operators = ['>>', '<<']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '>>': 'bit-right-shift',
    '<<': 'bit-left-shift',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators) ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = additive(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function additive(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = factor(scanner, literalFactory)

  const operators = ['+', '-']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '+': 'addition',
    '-': 'subtraction',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators) ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = factor(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function factor(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = exponentiation(scanner, literalFactory)

  const operators = ['/', '*', '%']
  const operatorMap: Record<string, BinaryExpression['operator']> = {
    '*': 'multiplication',
    '/': 'division',
    '%': 'modulus',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators) ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = exponentiation(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function exponentiation(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const left = unary(scanner, literalFactory)

  const matchedOperator = matchOperators(scanner, ['**'])

  if (matchedOperator !== null) {
    const right = exponentiation(scanner, literalFactory)
    return { type: 'binary', operator: 'exponentiation', left, right }
  } else {
    return left
  }
}

function unary(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const operatorMap: Record<string, UnaryExpression['operator']> = {
    '!': 'not',
    '~': 'bit-complement',
    '-': 'negate',
    not: 'not',
  } as const

  const operators: (typeof operatorMap)['string'][] = []

  while (true) {
    const operator = matchOperators(scanner, ['~', '!', '-', 'not'])

    if (operator !== null && operator in operatorMap) {
      operators.push(operatorMap[operator])
    } else {
      break
    }
  }

  let expression = value(scanner, literalFactory)
  for (const operator of operators) {
    expression = { type: 'unary', operator, expression }
  }

  return expression
}

function value(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const literal = match(scanner, 'literal')
  if (literal) {
    return {
      type: 'value',
      value: {
        type: 'constant',
        value: literalFactory.create(literal.value),
      },
    }
  }

  const parameter = match(scanner, 'parameter')
  if (parameter) {
    return {
      type: 'value',
      value: { type: 'parameter', name: parameter.name },
    }
  }

  const identifier = match(scanner, 'identifier')
  if (identifier) {
    const args: LogicalExpression[] = []

    if (!match(scanner, 'group-open')) {
      return {
        type: 'value',
        value: { type: 'parameter', name: identifier.identifier },
      }
    }

    if (!match(scanner, 'group-close')) {
      while (true) {
        args.push(logicalExpression(scanner, literalFactory))

        if (!match(scanner, 'separator')) break
      }
      matchOrThrow(scanner, 'group-close')
    }

    return { type: 'function', name: identifier.identifier, arguments: args }
  }

  if (match(scanner, 'group-open')) {
    if (match(scanner, 'group-close')) {
      return { type: 'value', value: { type: 'list', items: [] } }
    }

    const expression = logicalExpression(scanner, literalFactory)

    if (!match(scanner, 'separator')) {
      matchOrThrow(scanner, 'group-close')
      return expression
    }

    const items: LogicalExpression[] = [expression]

    if (!match(scanner, 'group-close')) {
      while (true) {
        items.push(logicalExpression(scanner, literalFactory))

        if (!match(scanner, 'separator')) break
        scanner.next()
      }
    }

    return { type: 'value', value: { type: 'list', items } }
  }

  throw new UnexpectedTokenError('literal', scanner.peek)
}
