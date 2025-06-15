import type { LogicalExpression } from './logical-expression'
import type { ValueCalculator } from './value-calculator'

type EvaluationOptions = {
  expressionArguments: Record<string, unknown>
  expressionFunctions: Record<string, ExpressionFunction>
  calculator: ValueCalculator
}

type ExpressionFunction = (
  args: unknown[],
  options: EvaluationOptions,
) => unknown

export function execute(
  logicalExpression: LogicalExpression,
  options: EvaluationOptions,
): unknown {
  switch (logicalExpression.type) {
    case 'value': {
      switch (logicalExpression.value.type) {
        case 'constant':
          return logicalExpression.value.value
        case 'parameter': {
          if (!(logicalExpression.value.name in options.expressionArguments))
            throw new Error('no arguments')
          return options.expressionArguments[logicalExpression.value.name]
        }
      }
    }
    case 'ternary':
      break
    case 'binary': {
      switch (logicalExpression.operator) {
        case 'subtraction':
          return options.calculator.sub(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'addition':
          return options.calculator.add(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'multiplication':
          return options.calculator.mul(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'division':
          return options.calculator.div(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'more-than':
          return options.calculator.moreThan(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'less-than':
          return options.calculator.lessThan(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'more-than-equal':
          return options.calculator.moreThanEqual(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'less-than-equal':
          return options.calculator.lessThanEqual(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'not-equals':
          return options.calculator.notEquals(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'equals':
          return options.calculator.equals(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'and':
          return options.calculator.and(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'or':
          return options.calculator.or(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'bit-and':
          return options.calculator.bitAnd(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'bit-or':
          return options.calculator.bitOr(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'bit-xor':
          return options.calculator.bitXor(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'bit-left-shift':
          return options.calculator.bitLeftShift(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
        case 'bit-right-shift':
          return options.calculator.bitRightShift(
            execute(logicalExpression.left, options),
            execute(logicalExpression.right, options),
          )
      }
      break
    }
    case 'unary': {
      switch (logicalExpression.operator) {
        case 'not':
          return options.calculator.not(
            execute(logicalExpression.expression, options),
          )
        case 'bit-complement':
          return options.calculator.bitComplement(
            execute(logicalExpression.expression, options),
          )
        case 'negate':
          return options.calculator.negate(
            execute(logicalExpression.expression, options),
          )
      }
    }
    case 'function': {
      const args = logicalExpression.arguments.map((arg) =>
        execute(arg, options),
      )
      if (logicalExpression.name in builtIns) {
        return builtIns[logicalExpression.name](args, options)
      }
      if (logicalExpression.name in options.expressionFunctions) {
        return options.expressionFunctions[logicalExpression.name](
          args,
          options,
        )
      }
    }
  }
}

const builtIns: Record<string, ExpressionFunction> = {
  Abs: (args) => (typeof args[0] === 'number' ? Math.abs(args[0]) : 0),
  Acos: (args) => (typeof args[0] === 'number' ? Math.acos(args[0]) : 0),
  Asin: (args) => (typeof args[0] === 'number' ? Math.asin(args[0]) : 0),
  Atan: (args) => (typeof args[0] === 'number' ? Math.atan(args[0]) : 0),
  Ceiling: (args) => (typeof args[0] === 'number' ? Math.ceil(args[0]) : 0),
  Cos: (args) => (typeof args[0] === 'number' ? Math.cos(args[0]) : 0),
  Exp: (args) => (typeof args[0] === 'number' ? Math.exp(args[0]) : 0),
  Floor: (args) => (typeof args[0] === 'number' ? Math.floor(args[0]) : 0),
  IEEERemainder: (args) => {
    if (
      args.length < 2 ||
      typeof args[0] !== 'number' ||
      typeof args[1] !== 'number'
    )
      return 0
    return args[0] - Math.round(args[0] / args[1]) * args[1]
  },
  Ln: (args) => (typeof args[0] === 'number' ? Math.log(args[0]) : 0),
  Log: (args) => {
    if (
      args.length < 2 ||
      typeof args[0] !== 'number' ||
      typeof args[1] !== 'number'
    )
      return 0
    return Math.log(args[0]) / Math.log(args[1])
  },
  Log10: (args) => (typeof args[0] === 'number' ? Math.log10(args[0]) : 0),
  Max: (args) => (args.length < 2 ? 0 : Math.max(...(args as number[]))),
  Min: (args) => (args.length < 2 ? 0 : Math.min(...(args as number[]))),
  Pow: (args) => {
    if (
      args.length < 2 ||
      typeof args[0] !== 'number' ||
      typeof args[1] !== 'number'
    )
      return 0
    return args[0] ** args[1]
  },
  Round: (args) => {
    if (args.length === 0 || typeof args[0] !== 'number') return 0
    const value = args[0]
    const digits = typeof args[1] === 'number' ? args[1] : 0
    const factor = 10 ** digits
    return Math.round(value * factor) / factor
  },
  Sign: (args) => {
    if (typeof args[0] !== 'number') return 0
    return Math.sign(args[0])
  },
  Sin: (args) => (typeof args[0] === 'number' ? Math.sin(args[0]) : 0),
  Sqrt: (args) => (typeof args[0] === 'number' ? Math.sqrt(args[0]) : 0),
  Tan: (args) => (typeof args[0] === 'number' ? Math.tan(args[0]) : 0),
  Truncate: (args) => {
    if (typeof args[0] !== 'number') return 0
    return args[0] < 0 ? Math.ceil(args[0]) : Math.floor(args[0])
  },
}
