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
  params: Record<string, ESCalcLiteParameter>
  lazyParams: Record<string, ESCalcLiteLazyParameter>
  functions: Record<string, ESCalcLiteExpressionFunction>
  valueCalculator: ESCalcLiteValueCalculator
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
