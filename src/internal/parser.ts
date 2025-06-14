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
  return additive(scanner, literalFactory)
}

function additive(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = factor(scanner, literalFactory)

  while (true) {
    let matchedType: null | 'subtraction' | 'addition' = null

    if (matchOperator(scanner, '+')) matchedType = 'addition'
    if (matchedType === null && matchOperator(scanner, '-'))
      matchedType = 'subtraction'

    switch (matchedType) {
      case 'subtraction':
      case 'addition': {
        const right = factor(scanner, literalFactory)
        left = { type: 'binary', operator: matchedType, left, right }
        break
      }
      case null:
        return left
    }
  }
}

function factor(
  scanner: Scanner,
  literalFactory: LiteralFactory,
): LogicalExpression {
  let left = value(scanner, literalFactory)

  while (true) {
    let matchedType: null | 'multiplication' | 'division' = null

    if (matchOperator(scanner, '*')) matchedType = 'multiplication'
    if (matchedType === null && matchOperator(scanner, '/'))
      matchedType = 'division'

    switch (matchedType) {
      case 'multiplication':
      case 'division': {
        const right = value(scanner, literalFactory)
        left = { type: 'binary', operator: matchedType, left, right }
        break
      }
      case null:
        return left
    }
  }
}

function matchOperator(
  scanner: Scanner,
  operator: string,
): Extract<Token, { type: 'operator' }> | null {
  const nextToken = scanner.peek

  if (
    nextToken === null ||
    nextToken.type !== 'operator' ||
    nextToken.operator !== operator
  ) {
    return null
  }

  scanner.next()
  return nextToken
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

        if (scanner.peek?.type !== 'comma') break
        scanner.next()
      }
    }

    if (scanner.next()?.type !== 'group-close') {
      throw new Error('Expected group-close')
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
