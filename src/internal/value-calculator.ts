import type { LogicalExpression } from './logical-expression'

export type ExpressionParameter = {
  expression: LogicalExpression
  evaluate: () => unknown
}

export abstract class ValueCalculator {
  abstract ternary(
    left: ExpressionParameter,
    middle: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract add(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract in(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract notIn(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract sub(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract div(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract mul(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract moreThan(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract lessThan(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract moreThanEqual(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract lessThanEqual(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract notEquals(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract equals(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract and(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract or(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract bitAnd(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract bitOr(left: ExpressionParameter, right: ExpressionParameter): unknown
  abstract bitXor(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract bitLeftShift(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract bitRightShift(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract modulus(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract exponentiation(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown
  abstract not(left: ExpressionParameter): unknown
  abstract bitComplement(left: ExpressionParameter): unknown
  abstract negate(left: ExpressionParameter): unknown
}

export class DefaultValueCalculator implements ValueCalculator {
  modulus(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue % rightValue
    }

    throw new Error('not implemented')
  }
  exponentiation(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue ** rightValue
    }

    throw new Error('not implemented')
  }
  in(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return rightValue.includes(leftValue)
    }

    if (!Array.isArray(rightValue)) {
      throw new TypeError('expected array')
    }

    return rightValue.includes(leftValue)
  }
  notIn(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return !rightValue.includes(leftValue)
    }

    if (!Array.isArray(rightValue)) {
      throw new TypeError('expected array')
    }

    return !rightValue.includes(leftValue)
  }
  moreThan(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue > rightValue
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return leftValue > rightValue
    }

    throw new Error('not implemented')
  }
  lessThan(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue < rightValue
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return leftValue < rightValue
    }

    throw new Error('not implemented')
  }
  moreThanEqual(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue >= rightValue
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return leftValue.getTime() >= rightValue.getTime()
    }

    throw new Error('not implemented')
  }
  lessThanEqual(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return left <= right
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return rightValue.getTime() <= rightValue.getTime()
    }

    throw new Error('not implemented')
  }
  notEquals(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
      return left !== right
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue !== rightValue
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return leftValue.getTime() !== rightValue.getTime()
    }

    throw new Error('not implemented')
  }

  equals(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue === rightValue
    }
    if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
      return leftValue === rightValue
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue === rightValue
    }

    if (leftValue instanceof Date && rightValue instanceof Date) {
      return leftValue.getTime() === rightValue.getTime()
    }

    throw new Error(`not implemented ${leftValue}=${rightValue}`)
  }
  and(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()

    if (typeof leftValue === 'boolean') {
      if (!leftValue) {
        return false
      }

      return right.evaluate()
    }

    throw new Error('not implemented')
  }
  or(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()

    if (typeof leftValue === 'boolean') {
      if (leftValue) {
        return true
      }

      return right.evaluate()
    }

    throw new Error('not implemented')
  }
  bitAnd(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue & rightValue
    }
    throw new Error('not implemented')
  }
  bitOr(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue | rightValue
    }
    throw new Error('not implemented')
  }
  bitXor(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue ^ rightValue
    }
    throw new Error('not implemented')
  }
  bitLeftShift(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue << rightValue
    }
    throw new Error('not implemented')
  }
  bitRightShift(
    left: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue >> rightValue
    }
    throw new Error('not implemented')
  }
  not(left: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'boolean') {
      return !leftValue
    }
    throw new Error('not implemented')
  }
  bitComplement(left: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'number') {
      return ~leftValue
    }
    throw new Error('not implemented')
  }
  negate(left: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'number') {
      return -leftValue
    }
    throw new Error('not implemented')
  }
  sub(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue
    }
    throw new Error('not implemented')
  }
  div(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue / rightValue
    }

    throw new Error('not implemented')
  }
  mul(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue * rightValue
    }
    throw new Error('not implemented')
  }

  add(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue + rightValue
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue + rightValue
    }

    throw new Error('not implemented')
  }

  ternary(
    left: ExpressionParameter,
    middle: ExpressionParameter,
    right: ExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue !== 'boolean') {
      throw new TypeError('expected boolean')
    }
    return leftValue ? middle.evaluate() : right.evaluate()
  }
}
