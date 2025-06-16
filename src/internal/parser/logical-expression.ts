export type LogicalExpression =
  | TernaryExpression
  | BinaryExpression
  | UnaryExpression
  | ValueExpression
  | FunctionExpression

export type TernaryExpression = {
  type: 'ternary'
  left: LogicalExpression
  right: LogicalExpression
  middle: LogicalExpression
}

export type BinaryExpression = {
  type: 'binary'
  operator:
    | 'subtraction'
    | 'addition'
    | 'multiplication'
    | 'division'
    | 'modulus'
    | 'exponentiation'
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

export type UnaryExpression = {
  type: 'unary'
  operator: 'not' | 'bit-complement' | 'negate'
  expression: LogicalExpression
}

export type ValueExpression = {
  type: 'value'
  value:
    | { type: 'constant'; value: unknown }
    | { type: 'parameter'; name: string }
    | { type: 'list'; items: LogicalExpression[] }
}

export type FunctionExpression = {
  type: 'function'
  name: string
  arguments: LogicalExpression[]
}
