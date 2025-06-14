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
