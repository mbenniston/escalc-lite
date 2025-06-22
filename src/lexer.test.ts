import { describe, expect, test } from 'vitest'
import { Lexer, type Token } from './lexer'

function getTokens(s: string): Token[] {
  const tokens = []
  let token
  const lexer = new Lexer(s)
  while ((token = lexer.next()) !== null) {
    tokens.push(token)
  }
  return tokens
}

describe('literal', () => {
  test('reads number', () => {
    expect(getTokens('1.23 .123 1e10 1.0e-20 1.e+10')).toStrictEqual([
      { type: 'number', value: '1.23' },
      { type: 'number', value: '.123' },
      { type: 'number', value: '1e10' },
      { type: 'number', value: '1.0e-20' },
      { type: 'number', value: '1.e+10' },
    ] satisfies Token[])
  })

  test('reads string', () => {
    expect(getTokens('"hello world"')).toStrictEqual([
      { type: 'string', value: 'hello world' },
    ] satisfies Token[])
  })

  test('reads boolean', () => {
    expect(getTokens('true false')).toStrictEqual([
      { type: 'boolean', value: 'true' },
      { type: 'boolean', value: 'false' },
    ] satisfies Token[])
  })

  test('reads date', () => {
    expect(getTokens('#12/11/2020#')).toStrictEqual([
      { type: 'date', value: '12/11/2020' },
    ] satisfies Token[])
  })
})

describe('literal', () => {
  test('reads identifier', () => {
    expect(getTokens('myIdentifier')).toStrictEqual([
      { type: 'identifier', value: 'myIdentifier' },
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
      { type: '+', value: '+' },
      { type: '-', value: '-' },
      { type: '/', value: '/' },
      { type: '*', value: '*' },
      { type: '%', value: '%' },
      { type: '**', value: '**' },
      { type: '<', value: '<' },
      { type: '>', value: '>' },
      { type: '<=', value: '<=' },
      { type: '>=', value: '>=' },
      { type: 'in', value: 'in' },
      { type: 'not', value: 'not' },
      { type: '!', value: '!' },
      { type: '!=', value: '!=' },
      { type: '=', value: '=' },
      { type: '?', value: '?' },
      { type: '<>', value: '<>' },
      { type: '&', value: '&' },
      { type: '|', value: '|' },
      { type: '&&', value: '&&' },
      { type: '||', value: '||' },
      { type: '^', value: '^' },
      { type: '~', value: '~' },
      { type: '&&', value: 'and' },
      { type: '||', value: 'or' },
    ] satisfies Token[])
  })
})

describe('keywords', () => {
  test('reads group open / close', () => {
    expect(getTokens('()')).toStrictEqual([
      { type: 'group-open', value: '(' },
      { type: 'group-close', value: ')' },
    ] satisfies Token[])
  })
  test('reads separators', () => {
    expect(getTokens(';,')).toStrictEqual([
      { type: 'separator', value: ',' },
      { type: 'separator', value: ',' },
    ] satisfies Token[])
  })
  test('reads group open / close', () => {
    expect(getTokens('[MyParam1] {MyParam}')).toStrictEqual([
      { type: 'parameter', value: 'MyParam1' },
      { type: 'parameter', value: 'MyParam' },
    ] satisfies Token[])
  })
  test('reads colon', () => {
    expect(getTokens(':')).toStrictEqual([
      { type: 'colon', value: ':' },
    ] satisfies Token[])
  })
})

test('can function without whitespace', () => {
  expect(getTokens('1.23+.123')).toStrictEqual([
    { type: 'number', value: '1.23' },
    { type: '+', value: '+' },
    { type: 'number', value: '.123' },
  ] satisfies Token[])
})
