export type LogicalExpression =
  | {
      type: 'ternary'
      left: LogicalExpression
      right: LogicalExpression
      middle: LogicalExpression
    }
  | {
      type: 'binary'
      operator: 'subtraction' | 'addition' | 'multiplication' | 'division'
      left: LogicalExpression
      right: LogicalExpression
    }
  | { type: 'unary'; expression: LogicalExpression }
  | { type: 'function'; name: string; arguments: LogicalExpression[] }
  | {
      type: 'value'
      value:
        | { type: 'constant'; value: unknown }
        | { type: 'parameter'; name: string }
    }
