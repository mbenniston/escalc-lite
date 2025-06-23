import { Lexer, type Token, type TokenType } from './lexer'

export type ESCalcLiteParseOptions = Partial<{
  // Factory that creates literals values such as numbers and booleans
  literalFactory: ESCalcLiteLiteralFactory
}>

export type ESCalcLiteLogicalExpression =
  | ESCalcLiteTernaryExpression
  | ESCalcLiteBinaryExpression
  | ESCalcLiteUnaryExpression
  | ESCalcLiteValueExpression
  | ESCalcLiteFunctionExpression

export type ESCalcLiteTernaryExpression = {
  type: 'ternary'
  left: ESCalcLiteLogicalExpression
  right: ESCalcLiteLogicalExpression
  middle: ESCalcLiteLogicalExpression
}

export type ESCalcLiteBinaryExpression = {
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
  left: ESCalcLiteLogicalExpression
  right: ESCalcLiteLogicalExpression
}

export type ESCalcLiteUnaryExpression = {
  type: 'unary'
  operator: 'not' | 'bit-complement' | 'negate'
  expression: ESCalcLiteLogicalExpression
}

export type ESCalcLiteValueExpression = {
  type: 'value'
  value:
    | { type: 'constant'; value: unknown }
    | { type: 'parameter'; name: string }
    | { type: 'list'; items: ESCalcLiteLogicalExpression[] }
}

export type ESCalcLiteFunctionExpression = {
  type: 'function'
  name: string
  arguments: ESCalcLiteLogicalExpression[]
}

export function parse(
  expression: string,
  options?: ESCalcLiteParseOptions,
): ESCalcLiteLogicalExpression {
  const parser = new Parser(
    expression,
    options?.literalFactory ?? new ESCalcLiteDefaultLiteralFactory(),
  )
  return parser.logicalExpression()
}

export function parseSafe(
  expression: string,
  options?: ESCalcLiteParseOptions,
):
  | { type: 'success'; expression: ESCalcLiteLogicalExpression }
  | { type: 'error'; error: unknown } {
  try {
    return { type: 'success', expression: parse(expression, options) }
  } catch (error) {
    return { type: 'error', error }
  }
}

export class Parser {
  private readonly lexer: Lexer

  constructor(
    readonly expression: string,
    private readonly literalFactory: ESCalcLiteLiteralFactory,
  ) {
    this.lexer = new Lexer(expression)
  }

  logicalExpression(): ESCalcLiteLogicalExpression {
    return this.ternary()
  }

  ternary(): ESCalcLiteLogicalExpression {
    let left = this.or()

    while (true) {
      const matchedOperator = this.match('?')
      if (matchedOperator === null) {
        return left
      }

      const middle = this.or()
      if (this.lexer.next()?.type !== 'colon') {
        throw new Error('Expected colon')
      }

      const right = this.or()
      left = { type: 'ternary', left, middle, right }
    }
  }

  or(): ESCalcLiteLogicalExpression {
    let left = this.and()

    while (true) {
      const matchedOperator = this.match('||')
      if (matchedOperator === null) {
        return left
      }

      const operator = orOperatorMap[matchedOperator.type]
      const right = this.and()
      left = { type: 'binary', operator, left, right }
    }
  }

  and(): ESCalcLiteLogicalExpression {
    let left = this.comparison()

    while (true) {
      const matchedOperator = this.match('&&')
      if (matchedOperator === null) {
        return left
      }

      const operator = andOperatorMap[matchedOperator.type]
      const right = this.comparison()
      left = { type: 'binary', operator, left, right }
    }
  }

  comparison(): ESCalcLiteLogicalExpression {
    let left = this.bitOr()

    while (true) {
      if (this.match('not')) {
        if (!this.match('in')) {
          throw new Error('expect in after not in comparison')
        }
        const items = this.bitOr()
        return { type: 'binary', operator: 'not-in', left, right: items }
      }
      if (this.match('in')) {
        const items = this.bitOr()
        return { type: 'binary', operator: 'in', left, right: items }
      }

      const matchedOperator = this.matchAnyOf([
        '>',
        '<',
        '<=',
        '>=',
        '!=',
        '==',
        '=',
        '<>',
      ])

      if (matchedOperator === null) {
        return left
      }
      const operator = comparisonOperatorMap[matchedOperator.type]
      const right = this.bitOr()
      left = { type: 'binary', operator, left, right }
    }
  }

  bitOr(): ESCalcLiteLogicalExpression {
    let left = this.bitXor()

    while (true) {
      const matchedOperator = this.match('|')
      if (matchedOperator === null) {
        return left
      }

      const operator = bitOrOperatorMap[matchedOperator.type]
      const right = this.bitXor()
      left = { type: 'binary', operator, left, right }
    }
  }

  bitXor(): ESCalcLiteLogicalExpression {
    let left = this.bitAnd()

    while (true) {
      const matchedOperator = this.match('^')
      if (matchedOperator === null) {
        return left
      }

      const operator = bitXorOperatorMap[matchedOperator.type]
      const right = this.bitAnd()
      left = { type: 'binary', operator, left, right }
    }
  }

  bitAnd(): ESCalcLiteLogicalExpression {
    let left = this.bitShift()

    while (true) {
      const matchedOperator = this.match('&')
      if (matchedOperator === null) {
        return left
      }

      const operator = bitAndOperatorMap[matchedOperator.type]
      const right = this.bitShift()
      left = { type: 'binary', operator, left, right }
    }
  }

  bitShift(): ESCalcLiteLogicalExpression {
    let left = this.additive()

    while (true) {
      const matchedOperator = this.matchAnyOf(['>>', '<<'])
      if (matchedOperator === null) {
        return left
      }

      const operator = bitShiftOperatorMap[matchedOperator.type]
      const right = this.additive()
      left = { type: 'binary', operator, left, right }
    }
  }

  additive(): ESCalcLiteLogicalExpression {
    let left = this.factor()

    while (true) {
      const matchedOperator = this.matchAnyOf(['+', '-'])
      if (matchedOperator === null) {
        return left
      }

      const operator = additionOperatorMap[matchedOperator.type]
      const right = this.factor()
      left = { type: 'binary', operator, left, right }
    }
  }

  factor(): ESCalcLiteLogicalExpression {
    let left = this.exponentiation()

    while (true) {
      const matchedOperator = this.matchAnyOf(['/', '*', '%'])
      if (matchedOperator === null) {
        return left
      }

      const operator = factorOperatorMap[matchedOperator.type]
      const right = this.exponentiation()
      left = { type: 'binary', operator, left, right }
    }
  }

  exponentiation(): ESCalcLiteLogicalExpression {
    const left = this.unary()

    const matchedOperator = this.match('**')
    if (matchedOperator === null) {
      return left
    }

    const right = this.exponentiation()
    return { type: 'binary', operator: 'exponentiation', left, right }
  }

  unary(): ESCalcLiteLogicalExpression {
    const operators: (typeof unaryOperatorMap)['string'][] = []

    while (true) {
      const operatorToken = this.matchAnyOf(['~', '!', '-', 'not'])
      if (operatorToken === null) {
        break
      }

      operators.push(unaryOperatorMap[operatorToken.type])
    }

    let expression = this.value()
    for (const operator of operators) {
      expression = { type: 'unary', operator, expression }
    }

    return expression
  }

  value(): ESCalcLiteLogicalExpression {
    const date = this.match('date')
    if (date) {
      return {
        type: 'value',
        value: {
          type: 'constant',
          value: this.literalFactory.create('date', date.value),
        },
      }
    }
    const string = this.match('string')
    if (string) {
      return {
        type: 'value',
        value: {
          type: 'constant',
          value: this.literalFactory.create('string', string.value),
        },
      }
    }

    const number = this.match('number')
    if (number) {
      return {
        type: 'value',
        value: {
          type: 'constant',
          value: this.literalFactory.create('number', number.value),
        },
      }
    }
    const boolean = this.match('boolean')
    if (boolean) {
      return {
        type: 'value',
        value: {
          type: 'constant',
          value: this.literalFactory.create('boolean', boolean.value),
        },
      }
    }

    const parameter = this.match('parameter')
    if (parameter) {
      return {
        type: 'value',
        value: { type: 'parameter', name: parameter.value },
      }
    }

    const identifier = this.match('identifier')
    if (identifier) {
      const args: ESCalcLiteLogicalExpression[] = []

      if (!this.match('group-open')) {
        return {
          type: 'value',
          value: { type: 'parameter', name: identifier.value },
        }
      }

      if (!this.match('group-close')) {
        while (true) {
          args.push(this.logicalExpression())

          if (this.lexer.peek?.type !== 'separator') break
          this.lexer.next()
        }

        if (!this.match('group-close')) {
          throw new Error(`Expected group-close got ${this.lexer.peek}`)
        }
      }

      return { type: 'function', name: identifier.value, arguments: args }
    }

    if (this.match('group-open')) {
      if (this.match('group-close')) {
        return { type: 'value', value: { type: 'list', items: [] } }
      }

      const expression = this.logicalExpression()

      if (!this.match('separator')) {
        if (!this.match('group-close')) {
          throw new Error(
            `expected group close got ${JSON.stringify(this.lexer.peek)}`,
          )
        }
        return expression
      }

      const items: ESCalcLiteLogicalExpression[] = [expression]

      if (!this.match('group-close')) {
        while (true) {
          items.push(this.logicalExpression())

          if (!this.match('separator')) break
          this.lexer.next()
        }

        if (!this.match('group-close')) {
          throw new Error(`Expected group-close got ${this.lexer.peek}`)
        }
      }

      return { type: 'value', value: { type: 'list', items } }
    }

    throw new Error(`Expected value got ${JSON.stringify(this.lexer.peek)}`)
  }

  matchAnyOf(types: TokenType[]): Token | null {
    const nextToken = this.lexer.peek

    if (nextToken === null || !types.includes(nextToken.type)) {
      return null
    }

    this.lexer.next()
    return nextToken
  }

  match(type: TokenType): Token | null {
    const nextToken = this.lexer.peek

    if (nextToken === null || nextToken.type !== type) {
      return null
    }

    this.lexer.next()
    return nextToken
  }
}

const orOperatorMap: Record<string, ESCalcLiteBinaryExpression['operator']> = {
  '||': 'or',
} as const

const andOperatorMap: Record<string, ESCalcLiteBinaryExpression['operator']> = {
  '&&': 'and',
} as const

const comparisonOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '>': 'more-than',
  '<': 'less-than',
  '<=': 'less-than-equal',
  '>=': 'more-than-equal',
  '!=': 'not-equals',
  '<>': 'not-equals',
  '==': 'equals',
  '=': 'equals',
} as const

const bitOrOperatorMap: Record<string, ESCalcLiteBinaryExpression['operator']> =
  {
    '|': 'bit-or',
  } as const

const bitXorOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '^': 'bit-xor',
} as const

const bitAndOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '&': 'bit-and',
} as const

const bitShiftOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '>>': 'bit-right-shift',
  '<<': 'bit-left-shift',
} as const

const additionOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '+': 'addition',
  '-': 'subtraction',
} as const

const factorOperatorMap: Record<
  string,
  ESCalcLiteBinaryExpression['operator']
> = {
  '*': 'multiplication',
  '/': 'division',
  '%': 'modulus',
} as const

const unaryOperatorMap: Record<string, ESCalcLiteUnaryExpression['operator']> =
  {
    '!': 'not',
    '~': 'bit-complement',
    '-': 'negate',
    not: 'not',
  } as const

export type ESCalcLiteLiteralTokenType =
  | 'date'
  | 'number'
  | 'boolean'
  | 'string'

export interface ESCalcLiteLiteralFactory {
  create: (type: ESCalcLiteLiteralTokenType, value: string) => unknown
}

export class ESCalcLiteDefaultLiteralFactory
  implements ESCalcLiteLiteralFactory
{
  create(type: ESCalcLiteLiteralTokenType, value: string): unknown {
    switch (type) {
      case 'number':
        return Number(value)
      case 'boolean': {
        if (value === 'false') return false
        if (value === 'true') return true
        throw new Error('invalid boolean value')
      }
      case 'string':
        return value
      case 'date':
        return new Date(value)
    }
  }
}
