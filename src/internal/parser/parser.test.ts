import { expect, test } from 'vitest'
import { parse } from './parser'
import type {
  BinaryExpression,
  FunctionExpression,
  TernaryExpression,
  UnaryExpression,
  ValueExpression,
} from './logical-expression'

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
  } satisfies BinaryExpression)
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
  } satisfies UnaryExpression)
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
  } satisfies TernaryExpression)
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
  } satisfies FunctionExpression)
})

test('value expression', () => {
  expect(parse('#11/06/2000#')).toStrictEqual({
    type: 'value',
    value: {
      type: 'constant',
      value: new Date(2000, 10, 6),
    },
  } satisfies ValueExpression)
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
