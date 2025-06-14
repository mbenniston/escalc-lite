import { expect, test } from 'vitest'
import { evaluate } from '../src'
import { parse } from '../src/parser'
import {
  BufferedIterator,
  CharacterIterator,
  Tokenizer,
} from '../src/tokenizer'
import type { LogicalExpression } from '../src/logical-expression'
import type { Token } from '../src/token'

test('evaluate with complex expression', () => {
  const ast = parse(
    '(((([a]+([b]*([c]-[d]/([e]+[f]))))-(([g]+[h])*([i]-([j]/([k]+[l]-[m])))))+([n]*([o]+[p]-([q]*[r]/([s]+[t])))))/((([u]+[v])*([w]-[x]+([y]/([z]+[aa]))))+([ab]-[ac]+([ad]/([ae]+[af]-[ag])))))+(([ah]*([ai]+[aj]-([ak]/([al]+[am]))))-(([an]+[ao])/([ap]-[aq]+[ar]))+[as])',
  )

  const result = evaluate(ast, {
    ['a']: 2,
    ['b']: 3,
    ['c']: 14,
    ['d']: 6,
    ['e']: 1,
    ['f']: 1,
    ['g']: 5,
    ['h']: 2,
    ['i']: 20,
    ['j']: 8,
    ['k']: 1,
    ['l']: 2,
    ['m']: 1,
    ['n']: 4,
    ['o']: 7,
    ['p']: 5,
    ['q']: 2,
    ['r']: 6,
    ['s']: 1,
    ['t']: 1,
    ['u']: 5,
    ['v']: 5,
    ['w']: 30,
    ['x']: 10,
    ['y']: 6,
    ['z']: 2,
    ['aa']: 1,
    ['ab']: 40,
    ['ac']: 10,
    ['ad']: 18,
    ['ae']: 2,
    ['af']: 1,
    ['ag']: 1,
    ['ah']: 3,
    ['ai']: 9,
    ['aj']: 6,
    ['ak']: 10,
    ['al']: 2,
    ['am']: 3,
    ['an']: 7,
    ['ao']: 3,
    ['ap']: 10,
    ['aq']: 2,
    ['ar']: 2,
    ['as']: 5,
  })

  expect(result.toSD(15).toString()).toBe('42.7953667953668')
})

test('evaluate with parameters', () => {
  const ast = parse('1 + 2 + [my parameter] + Sin(0)')

  expect(evaluate(ast, { ['my parameter']: 10 }).toNumber()).toBe(13)
})

test('evaluate after parse', () => {
  const ast = parse('12 + (4                        * 8 /2)')

  expect(evaluate(ast)).toBe(28)
})

test('parse', () => {
  const ast = parse('12 + Sin()')

  expect(ast).toStrictEqual({
    type: 'binary',
    operator: 'addition',
    left: { type: 'value', value: { type: 'constant', value: 12 } },
    right: {
      type: 'function',
      name: 'Sin',
      arguments: [
        { type: 'value', value: { type: 'constant', value: 4 } },
        { type: 'value', value: { type: 'constant', value: 2 } },
      ],
    },
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
    new BufferedIterator(
      new CharacterIterator('12 + 22 * 2 / 4 + Sin([my parameter],)'),
    ),
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
    { type: 'operator', operator: '+' },
    { type: 'identifier', identifier: 'Sin' },
    { type: 'group-open' },
    { type: 'parameter', name: 'my parameter' },
    { type: 'comma' },
    { type: 'group-close' },
  ] satisfies Token[])
})

test('evaluate', () => {
  expect(evaluate(testAst)).toBe(3)
})

const testAst: LogicalExpression = {
  type: 'binary',
  operator: 'addition',
  left: {
    type: 'value',
    value: { type: 'constant', value: 1 },
  },
  right: {
    type: 'value',
    value: { type: 'constant', value: 2 },
  },
}
