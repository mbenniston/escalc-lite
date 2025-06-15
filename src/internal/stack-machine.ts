import { Opcode, type Program } from './compiler'
import type { ValueCalculator } from './value-calculator'

type ExpressionFunction = (
  args: unknown[],
  globalParameters: Record<string, unknown>,
  expressionFunctions: Record<string, ExpressionFunction>,
  calculator: ValueCalculator,
) => unknown

export function execute(
  program: Program,
  expressionArguments: Record<string, unknown>,
  expressionFunctions: Record<string, ExpressionFunction>,
  calculator: ValueCalculator,
): unknown {
  const stack: unknown[] = new Array<unknown>()

  function push(d: unknown) {
    stack.push(d)
  }

  function pop() {
    const element = stack.pop()
    if (element === undefined) throw new Error('empty stack')
    return element
  }

  for (const instruction of program.instructions) {
    switch (instruction.opcode) {
      case Opcode.ADD:
        {
          const right = pop()
          const left = pop()
          push(calculator.add(left, right))
        }
        break
      case Opcode.SUB:
        {
          const right = pop()
          const left = pop()
          push(calculator.sub(left, right))
        }
        break
      case Opcode.MUL:
        {
          const right = pop()
          const left = pop()
          push(calculator.mul(left, right))
        }
        break
      case Opcode.DIV:
        {
          const right = pop()
          const left = pop()
          push(calculator.div(left, right))
        }
        break
      case Opcode.MORE_THAN:
        {
          const right = pop()
          const left = pop()
          push(calculator.moreThan(left, right))
        }
        break
      case Opcode.LESS_THAN:
        {
          const right = pop()
          const left = pop()
          push(calculator.lessThan(left, right))
        }
        break
      case Opcode.MORE_THAN_EQUAL:
        {
          const right = pop()
          const left = pop()
          push(calculator.moreThanEqual(left, right))
        }
        break
      case Opcode.LESS_THAN_EQUAL:
        {
          const right = pop()
          const left = pop()
          push(calculator.lessThanEqual(left, right))
        }
        break
      case Opcode.AND:
        {
          const right = pop()
          const left = pop()
          push(calculator.and(left, right))
        }
        break
      case Opcode.OR:
        {
          const right = pop()
          const left = pop()
          push(calculator.or(left, right))
        }
        break
      case Opcode.NOT:
        {
          const right = pop()
          push(calculator.not(right))
        }
        break
      case Opcode.NOT_EQUALS:
        {
          const right = pop()
          const left = pop()
          push(calculator.notEquals(left, right))
        }
        break
      case Opcode.EQUALS:
        {
          const right = pop()
          const left = pop()
          push(calculator.equals(left, right))
        }
        break
      case Opcode.BIT_AND:
        {
          const right = pop()
          const left = pop()
          push(calculator.bitAnd(left, right))
        }
        break
      case Opcode.BIT_XOR:
        {
          const right = pop()
          const left = pop()
          push(calculator.bitXor(left, right))
        }
        break
      case Opcode.BIT_OR:
        {
          const right = pop()
          const left = pop()
          push(calculator.bitOr(left, right))
        }
        break
      case Opcode.BIT_LEFT_SHIFT:
        {
          const right = pop()
          const left = pop()
          push(calculator.bitLeftShift(left, right))
        }
        break
      case Opcode.BIT_RIGHT_SHIFT:
        {
          const right = pop()
          const left = pop()
          push(calculator.bitRightShift(left, right))
        }
        break
      case Opcode.BIT_COMPLEMENT:
        {
          const right = pop()
          push(calculator.bitComplement(right))
        }
        break
      case Opcode.NEGATE:
        {
          const right = pop()
          push(calculator.negate(right))
        }
        break
      case Opcode.RETURN:
        break
      case Opcode.LOAD_CONSTANT:
        {
          push(instruction.constant)
        }
        break
      case Opcode.LOAD_PARAMETER:
        {
          if (
            !expressionArguments ||
            !(instruction.name in expressionArguments)
          )
            throw new Error('no arguments')
          push(expressionArguments[instruction.name])
        }
        break
      case Opcode.CALL:
        {
          if (expressionFunctions && instruction.name in expressionFunctions) {
            const f = expressionFunctions[instruction.name]
            const args: unknown[] = []
            for (let i = 0; i < instruction.arity; i++) {
              args.push(pop())
            }
            push(f(args, expressionArguments, expressionFunctions, calculator))
          } else if (instruction.name in builtIns) {
            const f = builtIns[instruction.name]
            const args: unknown[] = []
            for (let i = 0; i < instruction.arity; i++) {
              args.push(pop())
            }
            push(f(args, expressionArguments, expressionFunctions, calculator))
          } else {
            throw new Error('function not found')
          }
        }
        break
    }
  }

  return stack[0]
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
