import type { Stream } from './stream'

export class CharacterStream implements Stream<string> {
  private index: number = 0

  constructor(private readonly source: string) {}

  next() {
    if (this.index >= this.source.length) {
      return null
    }
    return this.source.charAt(this.index++)
  }
}
