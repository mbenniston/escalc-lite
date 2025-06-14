import { BufferedIterator, CharacterIterator, Tokenizer } from './tokenizer'
import type { LogicalExpression } from './logical-expression'
import type { Token } from './token'

export type Scanner = BufferedIterator<Token>

export function parse(expression: string): LogicalExpression {
  const scanner = new BufferedIterator(
    new Tokenizer(new BufferedIterator(new CharacterIterator(expression))),
  )

  return logicalExpression(scanner)
}

function logicalExpression(scanner: Scanner): LogicalExpression {
  return additive(scanner)
}

function additive(scanner: Scanner): LogicalExpression {
  let left = factor(scanner)

  while (true) {
    let matchedType: null | 'subtraction' | 'addition' = null

    if (matchOperator(scanner, '+')) matchedType = 'addition'
    if (matchedType === null && matchOperator(scanner, '-'))
      matchedType = 'subtraction'

    switch (matchedType) {
      case 'subtraction':
      case 'addition': {
        const right = factor(scanner)
        left = { type: 'binary', operator: matchedType, left, right }
        break
      }
      case null:
        return left
    }
  }
}

function factor(scanner: Scanner): LogicalExpression {
  let left = value(scanner)

  while (true) {
    let matchedType: null | 'multiplication' | 'division' = null

    if (matchOperator(scanner, '*')) matchedType = 'multiplication'
    if (matchedType === null && matchOperator(scanner, '/'))
      matchedType = 'division'

    switch (matchedType) {
      case 'multiplication':
      case 'division': {
        const right = value(scanner)
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

function value(scanner: Scanner): LogicalExpression {
  const nextToken = scanner.next()
  if (nextToken?.type === 'literal') {
    return {
      type: 'value',
      value: { type: 'constant', value: Number(nextToken.value) },
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
        args.push(logicalExpression(scanner))

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
    const expression = logicalExpression(scanner)

    const closeGroup = scanner.next()
    if (closeGroup?.type !== 'group-close') {
      throw new Error(`Expected group-close got ${JSON.stringify(closeGroup)}`)
    }

    return expression
  }

  throw new Error('Expected value')
}
