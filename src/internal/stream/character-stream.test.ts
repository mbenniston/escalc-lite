import { expect, test } from 'vitest'
import { CharacterStream } from './character-stream'

test('empty string', () => {
  const iterator = new CharacterStream('')
  expect(iterator.next()).toBeNull()
  expect(iterator.next()).toBeNull()
})

test('test string', () => {
  const iterator = new CharacterStream('this is a string')

  expect(iterator.next()).toBe('t')
  expect(iterator.next()).toBe('h')
  expect(iterator.next()).toBe('i')
  expect(iterator.next()).toBe('s')
  expect(iterator.next()).toBe(' ')
  expect(iterator.next()).toBe('i')
  expect(iterator.next()).toBe('s')
  expect(iterator.next()).toBe(' ')
  expect(iterator.next()).toBe('a')
  expect(iterator.next()).toBe(' ')
  expect(iterator.next()).toBe('s')
  expect(iterator.next()).toBe('t')
  expect(iterator.next()).toBe('r')
  expect(iterator.next()).toBe('i')
  expect(iterator.next()).toBe('n')
  expect(iterator.next()).toBe('g')
  expect(iterator.next()).toBeNull()
  expect(iterator.next()).toBeNull()
})
