import { describe, expect, test } from 'vitest'
import { BufferedStream } from '../stream/buffered-stream'
import { CharacterStream } from '../stream/character-stream'
import { collect } from '../stream/utils'
import { Tokenizer } from './tokenizer'
import type { Token } from './token'

function getTokens(s: string): Token[] {
  return collect(new Tokenizer(new BufferedStream(new CharacterStream(s))))
}

describe('literal', () => {
  test('reads number', () => {
    expect(getTokens('1.23 .123 1e10 1.0e-20 1.e+10')).toStrictEqual([
      { type: 'literal', value: { type: 'number', value: '1.23' } },
      { type: 'literal', value: { type: 'number', value: '.123' } },
      { type: 'literal', value: { type: 'number', value: '1e10' } },
      { type: 'literal', value: { type: 'number', value: '1.0e-20' } },
      { type: 'literal', value: { type: 'number', value: '1.e+10' } },
    ] satisfies Token[])
  })

  test('reads string', () => {
    expect(getTokens('"hello world"')).toStrictEqual([
      { type: 'literal', value: { type: 'string', value: 'hello world' } },
    ] satisfies Token[])
  })

  test('reads boolean', () => {
    expect(getTokens('true false')).toStrictEqual([
      { type: 'literal', value: { type: 'boolean', value: 'true' } },
      { type: 'literal', value: { type: 'boolean', value: 'false' } },
    ] satisfies Token[])
  })

  test('reads date', () => {
    expect(getTokens('#12/11/2020#')).toStrictEqual([
      { type: 'literal', value: { type: 'date', value: '12/11/2020' } },
    ] satisfies Token[])
  })
})

describe('literal', () => {
  test('reads identifier', () => {
    expect(getTokens('myIdentifier')).toStrictEqual([
      { type: 'identifier', identifier: 'myIdentifier' },
    ] satisfies Token[])
  })
})

describe('operator', () => {
  test('reads operators', () => {
    expect(
      getTokens(
        '+ - / * % ** < > <= >= in not ! != = ? <> & | && || ^ ~ and or',
      ),
    ).toStrictEqual([
      { type: 'operator', operator: '+' },
      { type: 'operator', operator: '-' },
      { type: 'operator', operator: '/' },
      { type: 'operator', operator: '*' },
      { type: 'operator', operator: '%' },
      { type: 'operator', operator: '**' },
      { type: 'operator', operator: '<' },
      { type: 'operator', operator: '>' },
      { type: 'operator', operator: '<=' },
      { type: 'operator', operator: '>=' },
      { type: 'operator', operator: 'in' },
      { type: 'operator', operator: 'not' },
      { type: 'operator', operator: '!' },
      { type: 'operator', operator: '!=' },
      { type: 'operator', operator: '=' },
      { type: 'operator', operator: '?' },
      { type: 'operator', operator: '<>' },
      { type: 'operator', operator: '&' },
      { type: 'operator', operator: '|' },
      { type: 'operator', operator: '&&' },
      { type: 'operator', operator: '||' },
      { type: 'operator', operator: '^' },
      { type: 'operator', operator: '~' },
      { type: 'operator', operator: '&&' },
      { type: 'operator', operator: '||' },
    ] satisfies Token[])
  })
})

describe('keywords', () => {
  test('reads group open / close', () => {
    expect(getTokens('()')).toStrictEqual([
      { type: 'group-open' },
      { type: 'group-close' },
    ] satisfies Token[])
  })
  test('reads separators', () => {
    expect(getTokens(';,')).toStrictEqual([
      { type: 'separator' },
      { type: 'separator' },
    ] satisfies Token[])
  })
  test('reads group open / close', () => {
    expect(getTokens('[MyParam1] {MyParam}')).toStrictEqual([
      { type: 'parameter', name: 'MyParam1' },
      { type: 'parameter', name: 'MyParam' },
    ] satisfies Token[])
  })
  test('reads colon', () => {
    expect(getTokens(':')).toStrictEqual([{ type: 'colon' }] satisfies Token[])
  })
})
