export type Token =
  | { type: 'literal'; value: string }
  | {
      type: 'operator'
      operator: string
    }
  | { type: 'group-open' }
  | { type: 'group-close' }
  | { type: 'parameter'; name: string }
