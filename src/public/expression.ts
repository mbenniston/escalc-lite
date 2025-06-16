import {
  builtIns,
  execute,
  type EvaluationOptions,
} from '../internal/evaluator/tree-walker'
import {
  DefaultValueCalculator,
  type ExpressionParameter,
  type ValueCalculator,
} from '../internal/evaluator/value-calculator'
import { collectParameters } from '../internal/parser/collect-parameters'
import {
  DefaultLiteralFactory,
  type LiteralFactory,
} from '../internal/parser/literal-factory'
import { parse } from '../internal/parser/parser'
import type { LogicalExpression } from '../internal/parser/logical-expression'

export class Expression {
  public static readonly BuiltIns = builtIns
  private readonly _logicalExpression: LogicalExpression
  public Parameters: Record<string, unknown> = {}
  public Functions: Record<
    string,
    (args: ExpressionParameter[], options: EvaluationOptions) => unknown
  > = {}
  public Calculator: ValueCalculator = new DefaultValueCalculator()
  private _requiredParameters: ReturnType<typeof collectParameters> | null =
    null

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
      expressionFunctions: this.Functions,
      calculator: this.Calculator,
    })
  }

  get RequiredParameters() {
    if (this._requiredParameters) return this._requiredParameters.parameters
    return (this._requiredParameters = collectParameters(
      this._logicalExpression,
    )).parameters
  }

  get RequiredFunctions() {
    if (this._requiredParameters) return this._requiredParameters.functions
    return (this._requiredParameters = collectParameters(
      this._logicalExpression,
    )).functions
  }
}
