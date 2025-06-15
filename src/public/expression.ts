import {
  DefaultLiteralFactory,
  type LiteralFactory,
} from '../internal/literal-factory'
import { parse } from '../internal/parser'
import {
  builtIns,
  execute,
  type EvaluationOptions,
} from '../internal/tree-walker'
import {
  DefaultValueCalculator,
  type ExpressionParameter,
  type ValueCalculator,
} from '../internal/value-calculator'
import type { LogicalExpression } from '../internal/logical-expression'

export class Expression {
  public static readonly BuiltIns = builtIns
  private readonly _logicalExpression: LogicalExpression
  public Parameters: Record<string, unknown> = {}
  public EvaluateFunctions: Record<
    string,
    (args: ExpressionParameter[], options: EvaluationOptions) => unknown
  > = {}
  public Calculator: ValueCalculator = new DefaultValueCalculator()

  constructor(
    public readonly expression: string,
    options: { literalFactory?: LiteralFactory } = {},
  ) {
    this._logicalExpression = parse(
      expression,
      options.literalFactory ?? new DefaultLiteralFactory(),
    )
  }

  Evaluate(): unknown {
    return execute(this._logicalExpression, {
      expressionArguments: this.Parameters,
      expressionFunctions: this.EvaluateFunctions,
      calculator: this.Calculator,
    })
  }
}
