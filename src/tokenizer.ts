import type { Token } from './token'

export class Tokenizer implements Iterator<Token> {
  constructor(private readonly source: BufferedIterator<string>) {}

  next(): Token | null {
    this.skipWhitespace()
    const nextCharacter = this.source.peek

    if (nextCharacter === null) return null

    if (isLiteral(nextCharacter)) {
      return this.literal()
    } else if (isOperator(nextCharacter)) {
      return this.operator()
    } else if (isGroupOpen(nextCharacter)) {
      return this.groupOpen()
    } else if (isGroupClose(nextCharacter)) {
      return this.groupClose()
    } else {
      throw new Error(`unrecognised input '${nextCharacter}'`)
    }
  }

  private skipWhitespace(): void {
    while (true) {
      const nextCharacter = this.source.peek
      if (nextCharacter === null || !isWhitespace(nextCharacter)) return
      this.source.next()
    }
  }

  private literal(): Token {
    let completeLiteral = ''
    while (true) {
      const nextCharacter = this.source.peek
      if (nextCharacter === null || !isLiteral(nextCharacter)) break
      completeLiteral += nextCharacter
      this.source.next()
    }
    return { type: 'literal', value: completeLiteral }
  }

  private operator(): Token {
    const operator = this.source.next()
    if (operator === null) throw new Error(`unrecognised input '${operator}'`)
    return { type: 'operator', operator }
  }

  private groupOpen(): Token {
    this.source.next()
    return { type: 'group-open' }
  }

  private groupClose(): Token {
    this.source.next()
    return { type: 'group-close' }
  }
}

function isLiteral(s: string): boolean {
  switch (s) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return true
  }
  return false
}

function isGroupOpen(s: string): boolean {
  return s === '('
}

function isGroupClose(s: string): boolean {
  return s === ')'
}

function isOperator(s: string): boolean {
  switch (s) {
    case '*':
    case '+':
    case '/':
    case '-':
      return true
  }
  return false
}

function isWhitespace(s: string): boolean {
  return s === ' '
}

abstract class Iterator<T> {
  public abstract next(): T | null
}

export class BufferedIterator<T> implements Iterator<T> {
  private _peek: T | null = null

  constructor(private readonly source: Iterator<T>) {}

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

export class CharacterIterator implements Iterator<string> {
  private index: number = 0

  constructor(private readonly source: string) {}

  next() {
    if (this.index >= this.source.length) {
      return null
    }
    return this.source.charAt(this.index++)
  }
}
