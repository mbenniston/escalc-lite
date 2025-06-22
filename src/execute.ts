import type { ESCalcLiteLogicalExpression } from './parse'
export type ESCalcLiteResult = unknown

export type ESCalcLiteExecuteOptions = Partial<{
  params: Record<string, unknown>
  lazyParams: Record<string, ESCalcLiteLazyParameter>
  functions: Record<string, ESCalcLiteExpressionFunction>
  valueCalculator: ESCalcLiteValueCalculator
}>

export type ESCalcLiteExpressionFunction = (
  args: ESCalcLiteExpressionParameter[],
  options: ESCalcLiteExecuteOptions,
) => unknown

export type ESCalcLiteLazyParameter = () => unknown

export function execute(
  expression: ESCalcLiteLogicalExpression,
  options?: ESCalcLiteExecuteOptions,
): unknown {
  const {
    params = {},
    functions = {},
    lazyParams = {},
    valueCalculator = new DefaultValueCalculator(),
  } = options ?? {}
  switch (expression.type) {
    case 'value':
      {
        switch (expression.value.type) {
          case 'list':
            return expression.value.items.map((item) => execute(item, options))
          case 'constant':
            return expression.value.value
          case 'parameter': {
            if (params && expression.value.name in params)
              return params[expression.value.name]
            if (lazyParams && expression.value.name in lazyParams)
              return lazyParams[expression.value.name]()

            throw new Error('no arguments')
          }
        }
      }
      break
    case 'ternary':
      {
        const leftParam: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.left, options),
          expression: expression.left,
        }
        const middleParam: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.middle, options),
          expression: expression.middle,
        }
        const rightParam: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.right, options),
          expression: expression.right,
        }

        return valueCalculator.ternary(leftParam, middleParam, rightParam)
      }
      break
    case 'binary':
      {
        const leftParam: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.left, options),
          expression: expression.left,
        }

        const rightParam: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.right, options),
          expression: expression.right,
        }

        switch (expression.operator) {
          case 'modulus':
            return valueCalculator.modulus(leftParam, rightParam)
          case 'exponentiation':
            return valueCalculator.exponentiation(leftParam, rightParam)
          case 'in':
            return valueCalculator.in(leftParam, rightParam)
          case 'not-in':
            return valueCalculator.notIn(leftParam, rightParam)
          case 'subtraction':
            return valueCalculator.sub(leftParam, rightParam)
          case 'addition':
            return valueCalculator.add(leftParam, rightParam)
          case 'multiplication':
            return valueCalculator.mul(leftParam, rightParam)
          case 'division':
            return valueCalculator.div(leftParam, rightParam)
          case 'more-than':
            return valueCalculator.moreThan(leftParam, rightParam)
          case 'less-than':
            return valueCalculator.lessThan(leftParam, rightParam)
          case 'more-than-equal':
            return valueCalculator.moreThanEqual(leftParam, rightParam)
          case 'less-than-equal':
            return valueCalculator.lessThanEqual(leftParam, rightParam)
          case 'not-equals':
            return valueCalculator.notEquals(leftParam, rightParam)
          case 'equals':
            return valueCalculator.equals(leftParam, rightParam)
          case 'and':
            return valueCalculator.and(leftParam, rightParam)
          case 'or':
            return valueCalculator.or(leftParam, rightParam)
          case 'bit-and':
            return valueCalculator.bitAnd(leftParam, rightParam)
          case 'bit-or':
            return valueCalculator.bitOr(leftParam, rightParam)
          case 'bit-xor':
            return valueCalculator.bitXor(leftParam, rightParam)
          case 'bit-left-shift':
            return valueCalculator.bitLeftShift(leftParam, rightParam)
          case 'bit-right-shift':
            return valueCalculator.bitRightShift(leftParam, rightParam)
        }
      }
      break
    case 'unary':
      {
        const param: ESCalcLiteExpressionParameter = {
          evaluate: () => execute(expression.expression, options),
          expression: expression.expression,
        }
        switch (expression.operator) {
          case 'not':
            return valueCalculator.not(param)
          case 'bit-complement':
            return valueCalculator.bitComplement(param)
          case 'negate':
            return valueCalculator.negate(param)
        }
      }
      break
    case 'function': {
      const args = expression.arguments.map((arg) => ({
        expression: arg,
        evaluate: () => execute(arg, options),
      }))

      if (expression.name in functions) {
        return functions[expression.name](args, {
          functions,
          params,
          lazyParams,
          valueCalculator,
        })
      }
      if (expression.name in ESCalcLiteBuiltIns) {
        return ESCalcLiteBuiltIns[expression.name](args, {
          functions,
          params,
          lazyParams,
          valueCalculator,
        })
      }
      break
    }
  }

  throw new Error(`unhandled expression ${JSON.stringify(expression)}`)
}

export function executeSafe(
  expression: ESCalcLiteLogicalExpression,
  options?: ESCalcLiteExecuteOptions,
):
  | { type: 'success'; result: ESCalcLiteResult }
  | { type: 'error'; error: unknown } {
  try {
    return { type: 'success', result: execute(expression, options) }
  } catch (error) {
    return { type: 'error', error }
  }
}

export const ESCalcLiteBuiltIns: Record<string, ESCalcLiteExpressionFunction> =
  {
    Abs: (args) => Math.abs(asNumber(args[0])),
    Acos: (args) => Math.acos(asNumber(args[0])),
    Asin: (args) => Math.asin(asNumber(args[0])),
    Atan: (args) => Math.atan(asNumber(args[0])),
    Ceiling: (args) => Math.ceil(asNumber(args[0])),
    Cos: (args) => Math.cos(asNumber(args[0])),
    Exp: (args) => Math.exp(asNumber(args[0])),
    Floor: (args) => Math.floor(asNumber(args[0])),
    IEEERemainder: (args) =>
      ieeeRemainder(asNumber(args[0]), asNumber(args[1])),
    Ln: (args) => Math.log(asNumber(args[0])),
    Log: (args) => {
      if (args.length === 1) return Math.log(asNumber(args[0]))
      return Math.log(asNumber(args[0])) / Math.log(asNumber(args[1]))
    },
    Log10: (args) => Math.log10(asNumber(args[0])),
    Max: (args) => Math.max(asNumber(args[0]), asNumber(args[1])),
    Min: (args) => Math.min(asNumber(args[0]), asNumber(args[1])),
    Pow: (args) => asNumber(args[0]) ** asNumber(args[1]),
    Round: (args) =>
      args.length === 2
        ? roundTo(asNumber(args[0]), asNumber(args[1]))
        : Math.round(asNumber(args[0])),
    Sign: (args) => Math.sign(asNumber(args[0])),
    Sin: (args) => Math.sin(asNumber(args[0])),
    Sqrt: (args) => Math.sqrt(asNumber(args[0])),
    Tan: (args) => Math.tan(asNumber(args[0])),
    Truncate: (args) => truncate(asNumber(args[0])),
    ['if']: (args) => {
      if (args.length !== 3) {
        throw new Error('if requires three parameters')
      }
      const condition = args[0].evaluate()
      if (typeof condition !== 'boolean') {
        throw new TypeError('condition must be a boolean')
      }
      return condition ? args[1].evaluate() : args[2].evaluate()
    },
    ['ifs']: (args) => {
      if (args.length < 3) {
        throw new Error('not enough parameters')
      }

      if (args.length % 2 === 0) {
        throw new Error('default must be provided')
      }

      let i = 0
      for (; i < args.length - 1; i += 2) {
        const condition = args[i].evaluate()
        if (typeof condition !== 'boolean') {
          throw new TypeError('condition must be a boolean')
        }
        if (condition) return args[i + 1].evaluate()
      }
      const defaultArg = args.at(-1)
      if (defaultArg === undefined) {
        throw new Error('Expect default')
      }
      return defaultArg.evaluate()
    },
  }

function asNumber(param?: ESCalcLiteExpressionParameter): number {
  if (param === undefined) {
    throw new TypeError(`Expected number got nothing`)
  }

  const value = param.evaluate()
  if (typeof value !== 'number') {
    throw new TypeError(`Expected number, got ${typeof value}`)
  }
  return value
}

function ieeeRemainder(x: number, y: number): number {
  return x - y * Math.round(x / y)
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function truncate(value: number): number {
  return value < 0 ? Math.ceil(value) : Math.floor(value)
}

export type ESCalcLiteExpressionParameter = {
  expression: ESCalcLiteLogicalExpression
  evaluate: () => unknown
}

export interface ESCalcLiteValueCalculator {
  ternary: (
    left: ESCalcLiteExpressionParameter,
    middle: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  add: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  in: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  notIn: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  sub: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  div: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  mul: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  moreThan: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  lessThan: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  moreThanEqual: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  lessThanEqual: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  notEquals: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  equals: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  and: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  or: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  bitAnd: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  bitOr: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  bitXor: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  bitLeftShift: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  bitRightShift: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  modulus: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  exponentiation: (
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ) => unknown
  not: (left: ESCalcLiteExpressionParameter) => unknown
  bitComplement: (left: ESCalcLiteExpressionParameter) => unknown
  negate: (left: ESCalcLiteExpressionParameter) => unknown
}

export class DefaultValueCalculator implements ESCalcLiteValueCalculator {
  modulus(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue % rightValue
    }

    throw new Error('not implemented')
  }
  exponentiation(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue ** rightValue
    }

    throw new Error('not implemented')
  }
  in(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
  notIn(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
  moreThan(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
  lessThan(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
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
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
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
  notEquals(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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

  equals(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
  and(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()

    if (typeof leftValue === 'boolean') {
      if (!leftValue) {
        return false
      }

      return right.evaluate()
    }

    throw new Error('not implemented')
  }
  or(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()

    if (typeof leftValue === 'boolean') {
      if (leftValue) {
        return true
      }

      return right.evaluate()
    }

    throw new Error('not implemented')
  }
  bitAnd(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue & rightValue
    }
    throw new Error('not implemented')
  }
  bitOr(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue | rightValue
    }
    throw new Error('not implemented')
  }
  bitXor(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue ^ rightValue
    }
    throw new Error('not implemented')
  }
  bitLeftShift(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue << rightValue
    }
    throw new Error('not implemented')
  }
  bitRightShift(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue >> rightValue
    }
    throw new Error('not implemented')
  }
  not(left: ESCalcLiteExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'boolean') {
      return !leftValue
    }
    throw new Error('not implemented')
  }
  bitComplement(left: ESCalcLiteExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'number') {
      return ~leftValue
    }
    throw new Error('not implemented')
  }
  negate(left: ESCalcLiteExpressionParameter): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue === 'number') {
      return -leftValue
    }
    throw new Error('not implemented')
  }
  sub(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue
    }
    throw new Error('not implemented')
  }
  div(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue / rightValue
    }

    throw new Error('not implemented')
  }
  mul(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue * rightValue
    }
    throw new Error('not implemented')
  }

  add(
    left: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
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
    left: ESCalcLiteExpressionParameter,
    middle: ESCalcLiteExpressionParameter,
    right: ESCalcLiteExpressionParameter,
  ): unknown {
    const leftValue = left.evaluate()
    if (typeof leftValue !== 'boolean') {
      throw new TypeError('expected boolean')
    }
    return leftValue ? middle.evaluate() : right.evaluate()
  }
}
