import { expect, test } from 'vitest'
import { format } from './format'
import { parse } from './parse'

test('reflexivity', () => {
  const expression = '1 + 2'
  const formatted = format(parse(expression))
  expect(expression).toBe(formatted)
})
