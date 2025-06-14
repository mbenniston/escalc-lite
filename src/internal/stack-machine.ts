import { Opcode, type Program } from './compiler'
type ExpressionFunction = (
  args: number[],
  globalParameters?: Record<string, number>,
  expressionFunctions?: Record<string, ExpressionFunction>,
) => number
export function execute(
  program: Program,
  expressionArguments?: Record<string, number>,
  expressionFunctions?: Record<string, ExpressionFunction>,
): number {
  const stack: number[] = new Array<number>()

  function push(d: number) {
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
          push(left + right)
        }
        break
      case Opcode.SUB:
        {
          const right = pop()
          const left = pop()
          push(left - right)
        }
        break
      case Opcode.MUL:
        {
          const right = pop()
          const left = pop()
          push(left * right)
        }
        break
      case Opcode.DIV:
        {
          const right = pop()
          const left = pop()
          push(left / right)
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
            const args: number[] = []
            for (let i = 0; i < instruction.arity; i++) {
              args.push(pop())
            }
            push(f(args, expressionArguments, expressionFunctions))
          } else if (instruction.name in builtIns) {
            const f = builtIns[instruction.name]
            const args: number[] = []
            for (let i = 0; i < instruction.arity; i++) {
              args.push(pop())
            }
            push(f(args, expressionArguments, expressionFunctions))
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
  Sin: (args) => Math.sin(args[0]),
}
