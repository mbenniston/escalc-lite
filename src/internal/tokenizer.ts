import type { Token } from './token'

export class Tokenizer implements Iterator<Token> {
  constructor(private readonly source: BufferedIterator<string>) {}

  next(): Token | null {
    this.skipWhitespace()
    const nextCharacter = this.source.peek

    if (nextCharacter === null) return null

    if (isNumber(nextCharacter)) {
      return this.number()
    } else if (isStringStart(nextCharacter)) {
      return this.string()
    } else if (isDateStart(nextCharacter)) {
      return this.date()
    } else if (isOperatorStart(nextCharacter)) {
      return this.operator()
    } else if (isGroupOpen(nextCharacter)) {
      return this.groupOpen()
    } else if (isColon(nextCharacter)) {
      return this.colon()
    } else if (isGroupClose(nextCharacter)) {
      return this.groupClose()
    } else if (isParameter(nextCharacter)) {
      return this.parameter()
    } else if (isSeparator(nextCharacter)) {
      return this.separator()
    } else if (isIdentifierStart(nextCharacter)) {
      return this.identifier()
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

  private colon(): Token {
    this.source.next()
    return { type: 'colon' }
  }

  private date(): Token {
    let completeLiteral = ''
    this.source.next()
    while (true) {
      const nextCharacter = this.source.peek
      if (nextCharacter === null) {
        throw new Error('Expected end of date')
      }
      if (nextCharacter === '#') break
      completeLiteral += nextCharacter
      this.source.next()
    }

    if (this.source.next() !== '#') {
      throw new Error('not a date end')
    }
    return {
      type: 'literal',
      value: { type: 'date', value: completeLiteral },
    }
  }

  private string(): Token {
    const stringStartChar = this.source.next()
    if (stringStartChar !== "'" && stringStartChar !== '"') {
      throw new Error('not a string start')
    }
    let contents = ''

    let withinEscape = false

    while (true) {
      const nextCharacter = this.source.peek
      if (nextCharacter === null) {
        throw new Error('Expected end of string')
      }
      if (nextCharacter === stringStartChar && !withinEscape) break
      if (
        withinEscape &&
        nextCharacter !== stringStartChar &&
        !['\\', 't', 'r'].includes(nextCharacter)
      ) {
        throw new Error('Expected end of escaped character')
      }

      if (withinEscape && nextCharacter === 'n') {
        contents += '\n'
        withinEscape = false
      } else if (withinEscape && nextCharacter === 't') {
        contents += '\t'
        withinEscape = false
      } else if (withinEscape && nextCharacter === 'r') {
        contents += '\r'
        withinEscape = false
      } else if (!withinEscape && nextCharacter === '\\') {
        withinEscape = true
      } else {
        contents += nextCharacter
        withinEscape = false
      }
      this.source.next()
    }

    if (this.source.next() !== stringStartChar) {
      throw new Error('not a string end')
    }

    return { type: 'literal', value: { type: 'string', value: contents } }
  }

  private number(): Token {
    let completeLiteral = ''
    while (true) {
      const nextCharacter = this.source.peek
      if (nextCharacter === null || !isNumber(nextCharacter)) break
      completeLiteral += nextCharacter
      this.source.next()
    }
    return {
      type: 'literal',
      value: { type: 'number', value: completeLiteral },
    }
  }

  private operator(): Token {
    const operator = this.source.next()
    if (operator === null) throw new Error(`unrecognised input '${operator}'`)

    const nextCharacter = this.source.peek
    if (
      (operator === '>' && nextCharacter === '=') ||
      (operator === '<' && nextCharacter === '=') ||
      (operator === '=' && nextCharacter === '=') ||
      (operator === '!' && nextCharacter === '=') ||
      (operator === '&' && nextCharacter === '&') ||
      (operator === '>' && nextCharacter === '>') ||
      (operator === '<' && nextCharacter === '<') ||
      (operator === '<' && nextCharacter === '>') ||
      (operator === '|' && nextCharacter === '|')
    ) {
      this.source.next()
      return { type: 'operator', operator: operator + nextCharacter }
    }

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

  private separator(): Token {
    this.source.next()
    return { type: 'separator' }
  }

  private identifier(): Token {
    let identifier = ''
    let nextCharacter = this.source.peek
    while (nextCharacter !== null && isIdentifier(nextCharacter)) {
      identifier += nextCharacter
      this.source.next()
      nextCharacter = this.source.peek
    }

    if (identifier === 'false' || identifier === 'true') {
      return { type: 'literal', value: { type: 'boolean', value: identifier } }
    }

    return { type: 'identifier', identifier }
  }

  private parameter(): Token {
    this.source.next()

    let name = ''
    let nextCharacter = this.source.peek
    while (nextCharacter !== ']' && nextCharacter !== null) {
      name += nextCharacter
      this.source.next()
      nextCharacter = this.source.peek
    }

    if (this.source.next() !== ']') throw new Error('Expected ]')

    return { type: 'parameter', name }
  }
}

function isNumber(s: string): boolean {
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

function isParameter(s: string): boolean {
  return s === '['
}

function isStringStart(s: string): boolean {
  return s === "'" || s === '"'
}

function isDateStart(s: string): boolean {
  return s === '#'
}

function isGroupOpen(s: string): boolean {
  return s === '('
}

function isGroupClose(s: string): boolean {
  return s === ')'
}

function isColon(s: string): boolean {
  return s === ':'
}

function isSeparator(s: string): boolean {
  return s === ',' || s === ';'
}

function isIdentifierStart(s: string): boolean {
  return s >= 'A' && s <= 'z'
}

function isIdentifier(s: string): boolean {
  return (s >= 'A' && s <= 'z') || (s >= '0' && s <= '9')
}

function isOperatorStart(s: string): boolean {
  switch (s) {
    case '*':
    case '+':
    case '/':
    case '-':
    case '>':
    case '<':
    case '=':
    case '!':
    case '?':
    case '^':
    case '~':
    case '|':
    case '&':
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
