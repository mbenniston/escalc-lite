import { describe, expect, test } from 'vitest'
import {
  ESCalcLiteDefaultLiteralFactory,
  parse,
  type ESCalcLiteBinaryExpression,
  type ESCalcLiteFunctionExpression,
  type ESCalcLiteTernaryExpression,
  type ESCalcLiteUnaryExpression,
  type ESCalcLiteValueExpression,
} from './parse'

test('binary operator', () => {
  expect(parse('1 + 2')).toStrictEqual({
    type: 'binary',
    operator: 'addition',
    left: {
      type: 'value',
      value: {
        type: 'constant',
        value: 1,
      },
    },
    right: {
      type: 'value',
      value: {
        type: 'constant',
        value: 2,
      },
    },
  } satisfies ESCalcLiteBinaryExpression)
})

test('unary operator', () => {
  expect(parse('-2')).toStrictEqual({
    type: 'unary',
    operator: 'negate',
    expression: {
      type: 'value',
      value: {
        type: 'constant',
        value: 2,
      },
    },
  } satisfies ESCalcLiteUnaryExpression)
})

test('ternary operator', () => {
  expect(parse('false ? 1 : 2')).toStrictEqual({
    type: 'ternary',
    left: {
      type: 'value',
      value: {
        type: 'constant',
        value: false,
      },
    },
    middle: {
      type: 'value',
      value: {
        type: 'constant',
        value: 1,
      },
    },
    right: {
      type: 'value',
      value: {
        type: 'constant',
        value: 2,
      },
    },
  } satisfies ESCalcLiteTernaryExpression)
})

test('function expression', () => {
  expect(parse('MyFunctionName(1,2,false)')).toStrictEqual({
    type: 'function',
    name: 'MyFunctionName',
    arguments: [
      {
        type: 'value',
        value: {
          type: 'constant',
          value: 1,
        },
      },
      {
        type: 'value',
        value: {
          type: 'constant',
          value: 2,
        },
      },
      {
        type: 'value',
        value: {
          type: 'constant',
          value: false,
        },
      },
    ],
  } satisfies ESCalcLiteFunctionExpression)
})

test('value expression', () => {
  expect(parse('#11/06/2000#')).toStrictEqual({
    type: 'value',
    value: {
      type: 'constant',
      value: new Date(2000, 10, 6),
    },
  } satisfies ESCalcLiteValueExpression)
})

test.each([
  '[1] < #11/06/2000#',
  '1 < 2',
  '1 > 2',
  '1 <= 2',
  '1 >= 2',
  '1 = 2',
  '1 != 2',
  '1 <> 2',
  'true && false',
  'true and false',
  'true || false',
  'true or false',
  '1  in (1,)',
  '1 not in (1,)',
  '1 + 2',
  '1 - 2',
  '1 * 2',
  '1 / 2',
  '1 % 2',
  '1 ** 2',
  'MyFunction(1,2)',
  '1 * MyParam * {MyParam} * [MyParam] * (1,2)',
  '()',
  '(1,)',
  '(1,2)',
  '!false',
  '!!false',
  '---1',
  '-1',
  '~1',
  '~~~~1',
  '1 | 2',
  '1 & 2',
  '1 ^ 2',
  '1 << 2',
  '1 >> 2',
  'Fun()',
])('complex %s', (expr) => {
  expect(parse(expr)).toMatchSnapshot(expr)
})

describe('ESCalcLiteDefaultLiteralFactory', () => {
  test('creates booleans', () => {
    const factory = new ESCalcLiteDefaultLiteralFactory()
    expect(factory.create('boolean', 'true')).toBe(true)
    expect(factory.create('boolean', 'false')).toBe(false)
    expect(() => factory.create('boolean', 'not a boolean')).toThrowError()
  })

  test('creates numbers', () => {
    const factory = new ESCalcLiteDefaultLiteralFactory()
    expect(factory.create('number', '1e+10')).toBe(1e10)
    expect(factory.create('number', 'not a number')).toBeNaN()
  })

  test('creates strings', () => {
    const factory = new ESCalcLiteDefaultLiteralFactory()
    expect(factory.create('string', 'this is a string')).toBe(
      'this is a string',
    )
  })

  test('creates dates', () => {
    const factory = new ESCalcLiteDefaultLiteralFactory()
    expect(factory.create('date', '12/11/2023')).toStrictEqual(
      new Date(2023, 11, 11),
    )
  })
})
