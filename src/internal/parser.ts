import { BufferedIterator, CharacterIterator, Tokenizer } from './tokenizer'
import type { LiteralFactory } from './literal-factory'
import type { LogicalExpression } from './logical-expression'
import type { Token } from './token'

export type Scanner = BufferedIterator<Token>

export function parse(
  expression: string,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const scanner = new BufferedIterator(
    new Tokenizer(new BufferedIterator(new CharacterIterator(expression))),
  )

  return logicalExpression(scanner, literalFactory)
}

function logicalExpression(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  return or(scanner, literalFactory)
}

function or(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = and(scanner, literalFactory)

  const operators = ['||']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '||': 'or',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = and(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}
function and(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = comparison(scanner, literalFactory)

  const operators = ['&&']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '&&': 'and',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = comparison(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function comparison(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = bitOr(scanner, literalFactory)

  const operators = ['>', '<', '<=', '>=', '!=', '==', '<>']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '>': 'more-than',
    '<': 'less-than',
    '<=': 'less-than-equal',
    '>=': 'more-than-equal',
    '!=': 'not-equals',
    '<>': 'not-equals',
    '==': 'equals',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitOr(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitOr(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = bitXor(scanner, literalFactory)

  const operators = ['|']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '|': 'bit-or',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitXor(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitXor(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = bitAnd(scanner, literalFactory)

  const operators = ['^']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '^': 'bit-xor',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitAnd(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitAnd(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = bitShift(scanner, literalFactory)

  const operators = ['&']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '&': 'bit-and',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = bitShift(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function bitShift(scanner: Scanner, literalFactory: LiteralFactory) {
  let left = additive(scanner, literalFactory)

  const operators = ['>>', '<<']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '>>': 'bit-right-shift',
    '<<': 'bit-left-shift',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

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
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '+': 'addition',
    '-': 'subtraction',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

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
  let left = unary(scanner, literalFactory)

  const operators = ['/', '*']
  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'binary' }>['operator']
  > = {
    '*': 'multiplication',
    '/': 'division',
  } as const

  while (true) {
    const matchedOperator = matchOperators(scanner, operators)?.operator ?? null

    if (matchedOperator !== null && matchedOperator in operatorMap) {
      const operator = operatorMap[matchedOperator]
      const right = unary(scanner, literalFactory)
      left = { type: 'binary', operator, left, right }
    } else {
      return left
    }
  }
}

function unary(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const operatorToken = matchOperators(scanner, ['~', '!', '-'])

  const v = value(scanner, literalFactory)

  const operatorMap: Record<
    string,
    Extract<LogicalExpression, { type: 'unary' }>['operator']
  > = {
    '!': 'not',
    '~': 'bit-complement',
    '-': 'negate',
  } as const

  if (operatorToken !== null && operatorToken.operator in operatorMap) {
    const operator = operatorMap[operatorToken.operator]
    return { type: 'unary', operator, expression: v }
  }

  return v
}

function value(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  const nextToken = scanner.next()
  if (nextToken?.type === 'literal') {
    return {
      type: 'value',
      value: {
        type: 'constant',
        value: literalFactory.create(nextToken.value),
      },
    }
  }

  if (nextToken?.type === 'parameter') {
    return {
      type: 'value',
      value: { type: 'parameter', name: nextToken.name },
    }
  }

  if (nextToken?.type === 'identifier') {
    scanner.next()
    const args: LogicalExpression[] = []

    if (scanner.peek?.type !== 'group-close') {
      while (true) {
        args.push(logicalExpression(scanner, literalFactory))

        if (scanner.peek?.type !== 'separator') break
        scanner.next()
      }
    }

    const groupCloseToken = scanner.next()?.type
    if (groupCloseToken !== 'group-close') {
      throw new Error(`Expected group-close got ${groupCloseToken}`)
    }

    return { type: 'function', name: nextToken.identifier, arguments: args }
  }

  if (nextToken?.type === 'group-open') {
    const expression = logicalExpression(scanner, literalFactory)

    const closeGroup = scanner.next()
    if (closeGroup?.type !== 'group-close') {
      throw new Error(`Expected group-close got ${JSON.stringify(closeGroup)}`)
    }

    return expression
  }

  throw new Error('Expected value')
}

function matchOperators(
  scanner: Scanner,
  operators: string[],
): Extract<Token, { type: 'operator' }> | null {
  const nextToken = scanner.peek

  if (
    nextToken === null ||
    nextToken.type !== 'operator' ||
    !operators.includes(nextToken.operator)
  ) {
    return null
  }

  scanner.next()
  return nextToken
}
