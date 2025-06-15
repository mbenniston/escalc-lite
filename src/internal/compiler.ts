import type { LogicalExpression } from './logical-expression'

export enum Opcode {
  LOAD_CONSTANT,
  LOAD_PARAMETER,
  ADD,
  SUB,
  MUL,
  DIV,
  MORE_THAN,
  LESS_THAN,
  MORE_THAN_EQUAL,
  LESS_THAN_EQUAL,
  NOT_EQUALS,
  EQUALS,
  AND,
  OR,
  BIT_AND,
  BIT_XOR,
  BIT_OR,
  BIT_LEFT_SHIFT,
  BIT_RIGHT_SHIFT,
  NOT,
  BIT_COMPLEMENT,
  NEGATE,
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
      opcode: Opcode.MORE_THAN
    }
  | {
      opcode: Opcode.LESS_THAN
    }
  | {
      opcode: Opcode.MORE_THAN_EQUAL
    }
  | {
      opcode: Opcode.LESS_THAN_EQUAL
    }
  | {
      opcode: Opcode.AND
    }
  | {
      opcode: Opcode.OR
    }
  | {
      opcode: Opcode.NOT
    }
  | {
      opcode: Opcode.NOT_EQUALS
    }
  | {
      opcode: Opcode.EQUALS
    }
  | {
      opcode: Opcode.BIT_AND
    }
  | {
      opcode: Opcode.BIT_XOR
    }
  | {
      opcode: Opcode.BIT_OR
    }
  | {
      opcode: Opcode.BIT_LEFT_SHIFT
    }
  | {
      opcode: Opcode.BIT_RIGHT_SHIFT
    }
  | {
      opcode: Opcode.BIT_COMPLEMENT
    }
  | {
      opcode: Opcode.NEGATE
    }
  | {
      opcode: Opcode.RETURN
    }
  | {
      opcode: Opcode.LOAD_CONSTANT
      constant: unknown
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
      {
        generate(logicalExpression.expression, program)
        switch (logicalExpression.operator) {
          case 'not':
            program.instructions.push({ opcode: Opcode.NOT })
            break
          case 'bit-complement':
            program.instructions.push({ opcode: Opcode.BIT_COMPLEMENT })
            break
          case 'negate':
            program.instructions.push({ opcode: Opcode.NEGATE })
            break
        }
      }
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
          case 'more-than':
            program.instructions.push({ opcode: Opcode.MORE_THAN })
            break
          case 'less-than':
            program.instructions.push({ opcode: Opcode.LESS_THAN })
            break
          case 'more-than-equal':
            program.instructions.push({ opcode: Opcode.MORE_THAN_EQUAL })
            break
          case 'less-than-equal':
            program.instructions.push({ opcode: Opcode.LESS_THAN_EQUAL })
            break
          case 'not-equals':
            program.instructions.push({ opcode: Opcode.NOT_EQUALS })
            break
          case 'equals':
            program.instructions.push({ opcode: Opcode.EQUALS })
            break
          case 'and':
            program.instructions.push({ opcode: Opcode.AND })
            break
          case 'or':
            program.instructions.push({ opcode: Opcode.OR })
            break
          case 'bit-and':
            program.instructions.push({ opcode: Opcode.BIT_AND })
            break
          case 'bit-or':
            program.instructions.push({ opcode: Opcode.BIT_OR })
            break
          case 'bit-xor':
            program.instructions.push({ opcode: Opcode.BIT_XOR })
            break
          case 'bit-left-shift':
            program.instructions.push({ opcode: Opcode.BIT_LEFT_SHIFT })
            break
          case 'bit-right-shift':
            program.instructions.push({ opcode: Opcode.BIT_RIGHT_SHIFT })
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
