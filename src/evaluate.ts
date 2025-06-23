import {
  execute,
  type ESCalcLiteExpressionFunction,
  type ESCalcLiteResult,
  type ESCalcLiteValueCalculator,
} from './execute'
import {
  ESCalcLiteDefaultLiteralFactory,
  Parser,
  type ESCalcLiteLiteralFactory,
  type ESCalcLiteLogicalExpression,
} from './parse'

export type ESCalcLiteEvaluateOptions = Partial<{
  // Map of parameters that are used when executing the expression
  params: Record<string, ESCalcLiteParameter>
  // Map of parameters that are evaluated on demand
  lazyParams: Record<string, ESCalcLiteLazyParameter>
  // Map of functions that are used when executing the expression
  functions: Record<string, ESCalcLiteExpressionFunction>
  // A set of operators that can be overridden to change how they behave when execution an expression
  valueCalculator: ESCalcLiteValueCalculator
  // Factory that creates literals values such as numbers and booleans
  literalFactory: ESCalcLiteLiteralFactory
}>

export type ESCalcLiteParameter = unknown
export type ESCalcLiteLazyParameter = () => unknown

export function evaluate(
  expression: string | ESCalcLiteLogicalExpression,
  options?: ESCalcLiteEvaluateOptions,
): ESCalcLiteResult {
  const expr =
    typeof expression === 'string'
      ? new Parser(
          expression,
          options?.literalFactory ?? new ESCalcLiteDefaultLiteralFactory(),
        ).logicalExpression()
      : expression

  return execute(expr, options)
}

export function evaluateSafe(
  expression: string,
  options?: ESCalcLiteEvaluateOptions,
):
  | { type: 'success'; result: ESCalcLiteResult }
  | { type: 'error'; error: unknown } {
  try {
    return { type: 'success', result: evaluate(expression, options) }
  } catch (error) {
    return { type: 'error', error }
  }
}
