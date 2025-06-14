import { expect, test } from 'vitest'
import { Expression } from '../src'

test('test ', () => {
  const e = new Expression('#12/11/2003#')
  expect(e.Evaluate()).toStrictEqual(new Date(2003, 11, 11))
})
