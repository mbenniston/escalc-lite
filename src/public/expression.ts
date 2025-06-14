import { compile, type Program } from '../internal/compiler'
import { parse } from '../internal/parser'
import { execute } from '../internal/stack-machine'

export class Expression {
  private readonly _program: Program
  public Parameters: Record<string, number> = {}
  public EvaluateFunctions: Record<string, (args: number[]) => number> = {}

  constructor(public readonly expression: string) {
    this._program = compile(parse(expression))
  }

  Evaluate() {
    return execute(this._program, this.Parameters, this.EvaluateFunctions)
  }
}
