export abstract class ValueCalculator {
  abstract add(left: unknown, right: unknown): unknown
  abstract sub(left: unknown, right: unknown): unknown
  abstract div(left: unknown, right: unknown): unknown
  abstract mul(left: unknown, right: unknown): unknown
  abstract neg(left: unknown): unknown
}

export class DefaultValueCalculator implements ValueCalculator {
  sub(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right
    }
    throw new Error('not implemented')
  }
  div(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left / right
    }

    throw new Error('not implemented')
  }
  mul(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left * right
    }
    throw new Error('not implemented')
  }
  neg(left: unknown): unknown {
    if (typeof left === 'number') {
      return -left
    }
    throw new Error('not implemented')
  }
  add(left: unknown, right: unknown): unknown {
    if (typeof left === 'string' && typeof right === 'string') {
      return left + right
    }
    if (typeof left === 'number' && typeof right === 'number') {
      return left + right
    }

    throw new Error('not implemented')
  }
}
