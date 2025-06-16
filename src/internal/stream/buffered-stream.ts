import type { Stream } from './stream'
export class BufferedStream<T> implements Stream<T> {
  private _peek: T | null = null

  constructor(private readonly source: Stream<T>) {}

  get peek() {
    if (this._peek === null) {
      this._peek = this.source.next()
    }
    return this._peek
  }

  next(): T | null {
    const oldPeek = this.peek
    this._peek = this.source.next()
    return oldPeek
  }
}
