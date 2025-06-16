export type Token =
  | LiteralToken
  | IdentifierToken
  | OperatorToken
  | GroupOpenToken
  | GroupCloseToken
  | SeparatorToken
  | ColonToken
  | ParameterToken

export type LiteralToken = {
  type: 'literal'
  value: { type: 'boolean' | 'string' | 'number' | 'date'; value: string }
}

export type IdentifierToken = { type: 'identifier'; identifier: string }

export type OperatorToken = {
  type: 'operator'
  operator: string
}

export type GroupOpenToken = { type: 'group-open' }
export type GroupCloseToken = { type: 'group-close' }
export type SeparatorToken = { type: 'separator' }
export type ColonToken = { type: 'colon' }
export type ParameterToken = { type: 'parameter'; name: string }
