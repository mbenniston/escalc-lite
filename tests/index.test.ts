import { expect, test } from 'vitest'
import { Expression } from '../src'

test('test ', () => {
  const e = new Expression('#12/11/2003#')
  expect(e.Evaluate()).toStrictEqual(new Date(2003, 11, 11))
})

test('test escape ', () => {
  const es = String.raw`"hello\\ worlds"`
  console.log(es)
  const e = new Expression(es)
  expect(e.Evaluate()).toStrictEqual(String.raw`hello\ worlds`)
})

test('test builtins ', () => {
  const e = new Expression('Max(7,4,6)')
  expect(e.Evaluate()).toStrictEqual(7)
})

test('operators ', () => {
  const e = new Expression(
    '((5 << 1) == 10 && (12 >> 2) == 3) || !(7 & 1 == 1 && (4 | 1) == 5) || (6 ^ 3) == 5',
  )
  expect(e.Evaluate()).toStrictEqual(true)
})

test('test date comparison', () => {
  const e = new Expression(
    '#2024-06-15# >= #2024-06-01# && #2024-06-15# <= #2024-12-31#',
  )
  expect(e.Evaluate()).toStrictEqual(true)
})
