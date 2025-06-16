import { describe, expect, test } from 'vitest'
import { DefaultLiteralFactory } from './literal-factory'

describe('DefaultLiteralFactory', () => {
  test('creates booleans', () => {
    const factory = new DefaultLiteralFactory()
    expect(factory.create({ type: 'boolean', value: 'true' })).toBe(true)
    expect(factory.create({ type: 'boolean', value: 'false' })).toBe(false)
    expect(() =>
      factory.create({ type: 'boolean', value: 'not a boolean' }),
    ).toThrowError()
  })

  test('creates numbers', () => {
    const factory = new DefaultLiteralFactory()
    expect(factory.create({ type: 'number', value: '1e+10' })).toBe(1e10)
    expect(factory.create({ type: 'number', value: 'not a number' })).toBeNaN()
  })

  test('creates strings', () => {
    const factory = new DefaultLiteralFactory()
    expect(factory.create({ type: 'string', value: 'this is a string' })).toBe(
      'this is a string',
    )
  })

  test('creates dates', () => {
    const factory = new DefaultLiteralFactory()
    expect(factory.create({ type: 'date', value: '12/11/2023' })).toStrictEqual(
      new Date(2023, 11, 11),
    )
  })
})
