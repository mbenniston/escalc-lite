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
    expect(getTokens('1.23')).toStrictEqual([
      { type: 'literal', value: { type: 'number', value: '1.23' } },
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
      getTokens('+ - / * % ** < > <= >= in not ! != = ? <> & | && || ^ ~'),
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
    ] satisfies Token[])
  })
})
