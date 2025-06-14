import type { Token } from './token'

export type Literal = Extract<Token, { type: 'literal' }>['value']

export abstract class LiteralFactory {
  abstract create(value: Literal): unknown
}

export class DefaultLiteralFactory implements LiteralFactory {
  create(value: Literal): unknown {
    switch (value.type) {
      case 'number':
        return Number(value)
      case 'boolean':
        return Boolean(value)
      case 'string':
        return value
    }
  }
}
