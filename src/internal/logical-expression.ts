export type LogicalExpression =
  | {
      type: 'ternary'
      left: LogicalExpression
      right: LogicalExpression
      middle: LogicalExpression
    }
  | {
      type: 'binary'
      operator:
        | 'subtraction'
        | 'addition'
        | 'multiplication'
        | 'division'
        | 'more-than'
        | 'less-than'
        | 'more-than-equal'
        | 'less-than-equal'
        | 'not-equals'
        | 'equals'
        | 'and'
        | 'or'
        | 'bit-and'
        | 'bit-or'
        | 'bit-xor'
        | 'bit-left-shift'
        | 'bit-right-shift'
        | 'in'
        | 'not-in'
      left: LogicalExpression
      right: LogicalExpression
    }
  | {
      type: 'unary'
      operator: 'not' | 'bit-complement' | 'negate'
      expression: LogicalExpression
    }
  | { type: 'function'; name: string; arguments: LogicalExpression[] }
  | {
      type: 'value'
      value:
        | { type: 'constant'; value: unknown }
        | { type: 'parameter'; name: string }
        | { type: 'list'; items: LogicalExpression[] }
    }
