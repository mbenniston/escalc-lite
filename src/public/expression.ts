import { compile, type Program } from '../internal/compiler'
import {
  DefaultLiteralFactory,
  type LiteralFactory,
} from '../internal/literal-factory'
import { parse } from '../internal/parser'
import { execute } from '../internal/stack-machine'
import {
  DefaultValueCalculator,
  type ValueCalculator,
} from '../internal/value-calculator'

export class Expression {
  private readonly _program: Program
  public Parameters: Record<string, unknown> = {}
  public EvaluateFunctions: Record<string, (args: unknown) => unknown> = {}
  public Calculator: ValueCalculator = new DefaultValueCalculator()

  constructor(
    public readonly expression: string,
    options: { literalFactory?: LiteralFactory } = {},
  ) {
    const ast = parse(
      expression,
      options.literalFactory ?? new DefaultLiteralFactory(),
    )
    this._program = compile(ast)
  }

  Evaluate(): unknown {
    return execute(
      this._program,
      this.Parameters,
      this.EvaluateFunctions,
      this.Calculator,
    )
  }
}
