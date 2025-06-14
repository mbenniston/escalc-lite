import { BufferedIterator, CharacterIterator, Tokenizer } from './tokenizer'
import type { LogicalExpression } from './logical-expression'
import type { Token } from './token'

export type Scanner = BufferedIterator<Token>

export function parse(expression: string): LogicalExpression {
  const scanner = new BufferedIterator(
    new Tokenizer(new BufferedIterator(new CharacterIterator(expression))),
  )

  return additive(scanner)
}

function additive(scanner: Scanner): LogicalExpression {
  const left = factor(scanner)

  while (true) {
    let matchedType: null | 'subtraction' | 'addition' = null

    if (matchOperator(scanner, '+')) matchedType = 'addition'
    if (matchedType === null && matchOperator(scanner, '-'))
      matchedType = 'subtraction'

    switch (matchedType) {
      case 'subtraction':
      case 'addition': {
        const right = factor(scanner)
        return { type: 'binary', operator: matchedType, left, right }
      }
      case null:
        return left
    }
  }
}

function factor(scanner: Scanner): LogicalExpression {
  const left = value(scanner)

  while (true) {
    let matchedType: null | 'multiplication' | 'division' = null

    if (matchOperator(scanner, '*')) matchedType = 'multiplication'
    if (matchedType === null && matchOperator(scanner, '/'))
      matchedType = 'division'

    switch (matchedType) {
      case 'multiplication':
      case 'division': {
        const right = value(scanner)
        return { type: 'binary', operator: matchedType, left, right }
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
): Extract<LogicalExpression, { type: 'value' }> {
  const nextToken = scanner.next()
  if (nextToken?.type !== 'literal') {
    throw new Error('Expected value')
  }

  return { type: 'value', value: Number(nextToken.value) }
}
