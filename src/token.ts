export type Token =
  | { type: 'literal'; value: string }
  | {
      type: 'operator'
      operator: string
    }
