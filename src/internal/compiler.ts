import type { LogicalExpression } from './logical-expression'

export enum Opcode {
  LOAD_CONSTANT,
  LOAD_PARAMETER,
  ADD,
  SUB,
  MUL,
  DIV,
  CALL,
  RETURN,
}

export type Instruction =
  | {
      opcode: Opcode.ADD
    }
  | {
      opcode: Opcode.SUB
    }
  | {
      opcode: Opcode.MUL
    }
  | {
      opcode: Opcode.DIV
    }
  | {
      opcode: Opcode.RETURN
    }
  | {
      opcode: Opcode.LOAD_CONSTANT
      constant: number
    }
  | {
      opcode: Opcode.LOAD_PARAMETER
      name: string
    }
  | {
      opcode: Opcode.CALL
      name: string
      arity: number
    }
export type Program = {
  instructions: Instruction[]
}

export function compile(logicalExpression: LogicalExpression): Program {
  const program: Program = { instructions: [] }

  generate(logicalExpression, program)
  program.instructions.push({ opcode: Opcode.RETURN })
  return program
}

export function generate(
  logicalExpression: LogicalExpression,
  program: Program,
): void {
  switch (logicalExpression.type) {
    case 'unary':
      break
    case 'ternary':
      break
    case 'binary':
      {
        generate(logicalExpression.left, program)
        generate(logicalExpression.right, program)
        switch (logicalExpression.operator) {
          case 'subtraction':
            program.instructions.push({ opcode: Opcode.SUB })
            break
          case 'addition':
            program.instructions.push({ opcode: Opcode.ADD })
            break
          case 'multiplication':
            program.instructions.push({ opcode: Opcode.MUL })
            break
          case 'division':
            program.instructions.push({ opcode: Opcode.DIV })
            break
        }
      }
      break
    case 'function':
      {
        for (const argument of logicalExpression.arguments) {
          generate(argument, program)
        }
        program.instructions.push({
          opcode: Opcode.CALL,
          name: logicalExpression.name,
          arity: logicalExpression.arguments.length,
        })
      }
      break
    case 'value':
      {
        switch (logicalExpression.value.type) {
          case 'constant':
            program.instructions.push({
              opcode: Opcode.LOAD_CONSTANT,
              constant: logicalExpression.value.value,
            })
            break
          case 'parameter':
            program.instructions.push({
              opcode: Opcode.LOAD_PARAMETER,
              name: logicalExpression.value.name,
            })
            break
        }
      }
      break
  }
}
