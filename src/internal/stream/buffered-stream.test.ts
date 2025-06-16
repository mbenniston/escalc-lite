import { expect, test, vi } from 'vitest'
import { BufferedStream } from './buffered-stream'
import { CharacterStream } from './character-stream'
import type { Stream } from './stream'

test('next progresses source stream', () => {
  const iterator = new BufferedStream(new CharacterStream('123'))

  expect(iterator.peek).toBe('1')
  expect(iterator.peek).toBe('1')
  expect(iterator.next()).toBe('1')

  expect(iterator.peek).toBe('2')
  expect(iterator.peek).toBe('2')
  expect(iterator.next()).toBe('2')

  expect(iterator.peek).toBe('3')
  expect(iterator.peek).toBe('3')
  expect(iterator.next()).toBe('3')

  expect(iterator.peek).toBeNull()
  expect(iterator.peek).toBeNull()
  expect(iterator.next()).toBeNull()

  expect(iterator.peek).toBeNull()
  expect(iterator.peek).toBeNull()
  expect(iterator.next()).toBeNull()
})

test('peek calls next on first call', () => {
  const mockNext = vi.fn(() => true)

  const iterator = new BufferedStream(
    new (class implements Stream<boolean> {
      next() {
        return mockNext()
      }
    })(),
  )

  expect(iterator.peek).toBe(true)
  expect(mockNext).toHaveBeenCalledOnce()
  expect(iterator.peek).toBe(true)
  expect(mockNext).toHaveBeenCalledOnce()
})
