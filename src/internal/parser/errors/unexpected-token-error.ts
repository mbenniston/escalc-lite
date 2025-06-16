import type { Token } from '../../tokenizer/token'

export class UnexpectedTokenError extends Error {
  constructor(
    public readonly expected: Token['type'],
    public readonly actual: Token | null,
  ) {
    super(`Expected token ${expected} got ${actual?.type}`)
    this.name = 'UnexpectedTokenError'
  }
}
