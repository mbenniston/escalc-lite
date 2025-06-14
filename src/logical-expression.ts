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
  | {
      type: 'value'
      value:
        | { type: 'constant'; value: number }
        | { type: 'parameter'; name: string }
    }
