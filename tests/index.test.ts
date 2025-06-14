import { expect, test } from 'vitest'
import { evaluate } from '../src'
import { parse } from '../src/parser'
import {
  BufferedIterator,
  CharacterIterator,
  Tokenizer,
} from '../src/tokenizer'
import type { LogicalExpression } from '../src/logical-expression'

test('evaluate after parse', () => {
  const ast = parse('12 + (4                        * 8 /2)')

  expect(evaluate(ast)).toBe(28)
})

test('parse', () => {
  const ast = parse('12 + 4')

  expect(ast).toStrictEqual({
    type: 'binary',
    operator: 'addition',
    left: { type: 'value', value: 12 },
    right: { type: 'value', value: 4 },
  } satisfies LogicalExpression)
})

test('buffer', () => {
  const buffered = new BufferedIterator(new CharacterIterator('12 +'))

  expect(buffered.peek).toBe('1')
  expect(buffered.next()).toBe('1')
  expect(buffered.peek).toBe('2')
  expect(buffered.next()).toBe('2')
  expect(buffered.peek).toBe(' ')
  expect(buffered.next()).toBe(' ')
  expect(buffered.peek).toBe('+')
  expect(buffered.next()).toBe('+')
  expect(buffered.peek).toBe(null)
  expect(buffered.next()).toBe(null)
})

test('tokenizer', () => {
  const scanner = new Tokenizer(
    new BufferedIterator(new CharacterIterator('12 + 22 * 2 / 4')),
  )
  const tokens = []

  let token = scanner.next()
  while (token !== null) {
    tokens.push(token)
    token = scanner.next()
  }

  expect(tokens).toStrictEqual([
    { type: 'literal', value: '12' },
    { type: 'operator', operator: '+' },
    { type: 'literal', value: '22' },
    { type: 'operator', operator: '*' },
    { type: 'literal', value: '2' },
    { type: 'operator', operator: '/' },
    { type: 'literal', value: '4' },
  ])
})

test('evaluate', () => {
  expect(evaluate(testAst)).toBe(3)
})

const testAst: LogicalExpression = {
  type: 'binary',
  operator: 'addition',
  left: {
    type: 'value',
    value: 1,
  },
  right: {
    type: 'value',
    value: 2,
  },
}
