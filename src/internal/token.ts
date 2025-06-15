export type Token =
  | {
      type: 'literal'
      value: { type: 'boolean' | 'string' | 'number' | 'date'; value: string }
    }
  | { type: 'identifier'; identifier: string }
  | {
      type: 'operator'
      operator: string
    }
  | { type: 'group-open' }
  | { type: 'group-close' }
  | { type: 'separator' }
  | { type: 'colon' }
  | { type: 'parameter'; name: string }
