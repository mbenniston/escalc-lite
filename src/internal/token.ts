export type Token =
  | { type: 'literal'; value: string }
  | { type: 'identifier'; identifier: string }
  | {
      type: 'operator'
      operator: string
    }
  | { type: 'group-open' }
  | { type: 'group-close' }
  | { type: 'comma' }
  | { type: 'parameter'; name: string }
