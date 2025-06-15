export abstract class ValueCalculator {
  abstract add(left: unknown, right: unknown): unknown
  abstract sub(left: unknown, right: unknown): unknown
  abstract div(left: unknown, right: unknown): unknown
  abstract mul(left: unknown, right: unknown): unknown
  abstract moreThan(left: unknown, right: unknown): unknown
  abstract lessThan(left: unknown, right: unknown): unknown
  abstract moreThanEqual(left: unknown, right: unknown): unknown
  abstract lessThanEqual(left: unknown, right: unknown): unknown
  abstract notEquals(left: unknown, right: unknown): unknown
  abstract equals(left: unknown, right: unknown): unknown
  abstract and(left: unknown, right: unknown): unknown
  abstract or(left: unknown, right: unknown): unknown
  abstract bitAnd(left: unknown, right: unknown): unknown
  abstract bitOr(left: unknown, right: unknown): unknown
  abstract bitXor(left: unknown, right: unknown): unknown
  abstract bitLeftShift(left: unknown, right: unknown): unknown
  abstract bitRightShift(left: unknown, right: unknown): unknown
  abstract not(left: unknown): unknown
  abstract bitComplement(left: unknown): unknown
  abstract negate(left: unknown): unknown
}

export class DefaultValueCalculator implements ValueCalculator {
  moreThan(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left > right
    }
    if (left instanceof Date && right instanceof Date) {
      return left > right
    }
    throw new Error('not implemented')
  }
  lessThan(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left < right
    }
    if (left instanceof Date && right instanceof Date) {
      return left < right
    }
    throw new Error('not implemented')
  }
  moreThanEqual(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left >= right
    }
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() >= right.getTime()
    }
    throw new Error('not implemented')
  }
  lessThanEqual(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left <= right
    }
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() <= right.getTime()
    }
    throw new Error('not implemented')
  }
  notEquals(left: unknown, right: unknown): unknown {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left !== right
    }
    if (typeof left === 'number' && typeof right === 'number') {
      return left !== right
    }
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() !== right.getTime()
    }
    throw new Error('not implemented')
  }
  equals(left: unknown, right: unknown): unknown {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left === right
    }
    if (typeof left === 'number' && typeof right === 'number') {
      return left === right
    }
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() === right.getTime()
    }
    throw new Error('not implemented')
  }
  and(left: unknown, right: unknown): unknown {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left && right
    }
    throw new Error('not implemented')
  }
  or(left: unknown, right: unknown): unknown {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left || right
    }
    throw new Error('not implemented')
  }
  bitAnd(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left & right
    }
    throw new Error('not implemented')
  }
  bitOr(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left | right
    }
    throw new Error('not implemented')
  }
  bitXor(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left ^ right
    }
    throw new Error('not implemented')
  }
  bitLeftShift(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left << right
    }
    throw new Error('not implemented')
  }
  bitRightShift(left: unknown, right: unknown): unknown {
    if (typeof left === 'number' && typeof right === 'number') {
      return left >> right
    }
    throw new Error('not implemented')
  }
  not(left: unknown): unknown {
    if (typeof left === 'boolean') {
      return !left
    }
    throw new Error('not implemented')
  }
  bitComplement(left: unknown): unknown {
    if (typeof left === 'number') {
      return ~left
    }
    throw new Error('not implemented')
  }
  negate(left: unknown): unknown {
    if (typeof left === 'number') {
      return -left
    }
    throw new Error('not implemented')
  }
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
