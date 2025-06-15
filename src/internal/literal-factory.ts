import type { Token } from './token'

export type Literal = Extract<Token, { type: 'literal' }>['value']

export abstract class LiteralFactory {
  abstract create(value: Literal): unknown
}

export class DefaultLiteralFactory implements LiteralFactory {
  create(value: Literal): unknown {
    switch (value.type) {
      case 'number':
        return Number(value.value)
      case 'boolean': {
        if (value.value === 'false') return false
        if (value.value === 'true') return true
        throw new Error('invalid boolean value')
      }
      case 'string':
        return value.value
      case 'date':
        return new Date(value.value)
    }
  }
}
