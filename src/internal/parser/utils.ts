import type { BufferedStream } from '../stream/buffered-stream'
import type { Token } from '../tokenizer/token'
import { UnexpectedTokenError } from './errors/unexpected-token-error'
export type Scanner = BufferedStream<Token>

export function matchOperators(
  scanner: Scanner,
  operators: string[],
): string | null {
  const nextToken = scanner.peek

  if (
    nextToken === null ||
    nextToken.type !== 'operator' ||
    !operators.includes(nextToken.operator)
  ) {
    return null
  }

  scanner.next()
  return nextToken.operator
}

export function matchOrThrow<T extends Token['type']>(
  scanner: Scanner,
  tokenType: T,
): Extract<Token, { type: T }> {
  const token = match(scanner, tokenType)
  if (token === null) {
    throw new UnexpectedTokenError(tokenType, scanner.peek)
  }

  return token
}

export function match<T extends Token['type']>(
  scanner: Scanner,
  tokenType: T,
): Extract<Token, { type: T }> | null {
  const nextToken = scanner.peek

  if (nextToken === null || !isOfTokenType(nextToken, tokenType)) {
    return null
  }

  scanner.next()
  return nextToken
}

function isOfTokenType<T extends Token['type']>(
  token: Token,
  tokenType: T,
): token is Extract<Token, { type: T }> {
  return token.type === tokenType
}
