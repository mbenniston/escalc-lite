import { expect, test } from 'vitest'
import { Expression } from '../src'

test('test ', () => {
  const e = new Expression('#12/11/2003#')
  expect(e.Evaluate()).toStrictEqual(new Date(2003, 11, 11))
})

test('test escape ', () => {
  const es = `"hello\\\\ \\t \\r worlds"`
  const e = new Expression(es)
  expect(e.Evaluate()).toStrictEqual(`hello\\ \t \r worlds`)
})

test('test builtins ', () => {
  const e = new Expression(' 1 + 2 * 3 > 6 && 4 | 2 ^ 1 == 7 ? 100 : 200')
  expect(e.Evaluate()).toStrictEqual(100)
})

test('test separators ', () => {
  const e = new Expression('"Hello" in (0,)')
  e.Parameters = { foo: 0 }
  expect(e.Evaluate()).toStrictEqual(false)
})

test('operators ', () => {
  const e = new Expression('Max(Max(1,3),2) + 1')
  expect(e.Evaluate()).toStrictEqual(true)
})

test('test date comparison', () => {
  const e = new Expression(
    '#2024-06-15# >= #2024-06-01# && #2024-06-15# <= #2024-12-31#',
  )
  expect(e.Evaluate()).toStrictEqual(true)
})

test('test complex2', () => {
  const ast = new Expression(
    'Max(' +
      'Max(' +
      'Max(' +
      'Max(' +
      'Abs([a] - Sqrt([b] * [c])),' +
      'Sin([d] + [e]) * Cos([f] - [g])' +
      '),' +
      '(([h] + [i]) ^ 2) / Ln([j] + 10)' +
      '),' +
      'Min([k], [l] + [m] * 2)' +
      '),' +
      'Ln(Sqrt(Abs([n] - [o] + Min([p], [q]))))' +
      ') + Sqrt(Abs([r] - [s] / Max([t], 1)))',
  )

  ast.Parameters = {
    ['a']: 25,
    ['b']: 4,
    ['c']: 9,
    ['d']: Math.PI / 2,
    ['e']: 0,
    ['f']: 0,
    ['g']: 0,
    ['h']: 2,
    ['i']: 3,
    ['j']: 5,
    ['k']: 20,
    ['l']: 6,
    ['m']: 2,
    ['n']: 18,
    ['o']: 4,
    ['p']: 3,
    ['q']: 10,
    ['r']: 20,
    ['s']: 5,
    ['t']: 0,
  }
  expect(ast.Evaluate()).toBeCloseTo(22.872983346207416, 3)
})
