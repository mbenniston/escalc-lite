import type { LogicalExpression } from './logical-expression'
import type { ExpressionParameter, ValueCalculator } from './value-calculator'

export type EvaluationOptions = {
  expressionArguments: Record<string, unknown>
  expressionFunctions: Record<string, ExpressionFunction>
  calculator: ValueCalculator
}

type ExpressionFunction = (
  args: ExpressionParameter[],
  options: EvaluationOptions,
) => unknown

export function execute(
  expression: LogicalExpression,
  options: EvaluationOptions,
): unknown {
  switch (expression.type) {
    case 'value': {
      switch (expression.value.type) {
        case 'list':
          return expression.value.items.map((item) => execute(item, options))
        case 'constant':
          return expression.value.value
        case 'parameter': {
          if (!(expression.value.name in options.expressionArguments))
            throw new Error('no arguments')
          return options.expressionArguments[expression.value.name]
        }
      }
      break
    }
    case 'ternary':
      {
        const leftParam: ExpressionParameter = {
          evaluate: () => execute(expression.left, options),
          expression: expression.left,
        }
        const middleParam: ExpressionParameter = {
          evaluate: () => execute(expression.middle, options),
          expression: expression.middle,
        }
        const rightParam: ExpressionParameter = {
          evaluate: () => execute(expression.right, options),
          expression: expression.right,
        }

        return options.calculator.ternary(leftParam, middleParam, rightParam)
      }
      break
    case 'binary': {
      const leftParam: ExpressionParameter = {
        evaluate: () => execute(expression.left, options),
        expression: expression.left,
      }

      const rightParam: ExpressionParameter = {
        evaluate: () => execute(expression.right, options),
        expression: expression.right,
      }

      switch (expression.operator) {
        case 'modulus':
          return options.calculator.modulus(leftParam, rightParam)
        case 'exponentiation':
          return options.calculator.exponentiation(leftParam, rightParam)
        case 'in':
          return options.calculator.in(leftParam, rightParam)
        case 'not-in':
          return options.calculator.notIn(leftParam, rightParam)
        case 'subtraction':
          return options.calculator.sub(leftParam, rightParam)
        case 'addition':
          return options.calculator.add(leftParam, rightParam)
        case 'multiplication':
          return options.calculator.mul(leftParam, rightParam)
        case 'division':
          return options.calculator.div(leftParam, rightParam)
        case 'more-than':
          return options.calculator.moreThan(leftParam, rightParam)
        case 'less-than':
          return options.calculator.lessThan(leftParam, rightParam)
        case 'more-than-equal':
          return options.calculator.moreThanEqual(leftParam, rightParam)
        case 'less-than-equal':
          return options.calculator.lessThanEqual(leftParam, rightParam)
        case 'not-equals':
          return options.calculator.notEquals(leftParam, rightParam)
        case 'equals':
          return options.calculator.equals(leftParam, rightParam)
        case 'and':
          return options.calculator.and(leftParam, rightParam)
        case 'or':
          return options.calculator.or(leftParam, rightParam)
        case 'bit-and':
          return options.calculator.bitAnd(leftParam, rightParam)
        case 'bit-or':
          return options.calculator.bitOr(leftParam, rightParam)
        case 'bit-xor':
          return options.calculator.bitXor(leftParam, rightParam)
        case 'bit-left-shift':
          return options.calculator.bitLeftShift(leftParam, rightParam)
        case 'bit-right-shift':
          return options.calculator.bitRightShift(leftParam, rightParam)
      }
      break
    }
    case 'unary':
      {
        const param: ExpressionParameter = {
          evaluate: () => execute(expression.expression, options),
          expression: expression.expression,
        }
        switch (expression.operator) {
          case 'not':
            return options.calculator.not(param)
          case 'bit-complement':
            return options.calculator.bitComplement(param)
          case 'negate':
            return options.calculator.negate(param)
        }
      }
      break
    case 'function': {
      const args = expression.arguments.map((arg) => ({
        expression: arg,
        evaluate: () => execute(arg, options),
      }))

      if (expression.name in options.expressionFunctions) {
        return options.expressionFunctions[expression.name](args, options)
      }
      if (expression.name in builtIns) {
        return builtIns[expression.name](args, options)
      }
      break
    }
  }

  throw new Error(`unhandled expression ${JSON.stringify(expression)}`)
}

export const builtIns: Record<string, ExpressionFunction> = {
  Abs: (args) => Math.abs(asNumber(args[0])),
  Acos: (args) => Math.acos(asNumber(args[0])),
  Asin: (args) => Math.asin(asNumber(args[0])),
  Atan: (args) => Math.atan(asNumber(args[0])),
  Ceiling: (args) => Math.ceil(asNumber(args[0])),
  Cos: (args) => Math.cos(asNumber(args[0])),
  Exp: (args) => Math.exp(asNumber(args[0])),
  Floor: (args) => Math.floor(asNumber(args[0])),
  IEEERemainder: (args) => ieeeRemainder(asNumber(args[0]), asNumber(args[1])),
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

function asNumber(param?: ExpressionParameter): number {
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
