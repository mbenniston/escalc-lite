export { type Stream } from './stream'

export function collect<T>(iterator: Stream<T>): T[] {
  const items: T[] = []
  let item
  while ((item = iterator.next()) !== null) {
    items.push(item)
  }
  return items
}
