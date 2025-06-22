export type TokenType =
  | 'group-open'
  | 'group-close'
  | 'separator'
  | 'colon'
  | 'parameter'
  | 'boolean'
  | 'string'
  | 'number'
  | 'date'
  | 'identifier'
  | '&&'
  | '>'
  | '<'
  | '<='
  | '>='
  | '!='
  | '<>'
  | '=='
  | '='
  | '-'
  | '|'
  | '**'
  | '^'
  | '&'
  | '>>'
  | '<<'
  | '+'
  | '*'
  | '?'
  | '||'
  | '/'
  | '%'
  | '!'
  | '~'
  | 'in'
  | 'not'
export type Token = {
  type: TokenType
  value: string
}

export class Lexer {
  private index: number = 0
  private _nextToken: null | Token = null
  private _currentToken: null | Token = null

  constructor(private readonly input: string) {}

  get peekChar(): string | null {
    if (this.index < this.input.length) {
      return this.input[this.index]
    }
    return null
  }

  nextChar(): string | null {
    if (this.index < this.input.length) {
      const c = this.input[this.index]
      this.index++
      return c
    }
    return null
  }

  get peek(): Token | null {
    if (this._nextToken !== null) return this._nextToken
    return (this._nextToken = this.getNext())
  }

  next(): Token | null {
    this._currentToken = this.peek
    this._nextToken = this.getNext()
    return this._currentToken
  }
  private getNext(): Token | null {
    this.skipWhitespace()
    const nextCharacter = this.peekChar

    if (nextCharacter === null) return null

    if (isNumberStart(nextCharacter)) {
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
      const nextCharacter = this.peekChar
      if (nextCharacter === null || !isWhitespace(nextCharacter)) return
      this.nextChar()
    }
  }

  private colon(): Token {
    this.nextChar()
    return { type: 'colon', value: ':' }
  }

  private date(): Token {
    let completeLiteral = ''
    this.nextChar()
    while (true) {
      const nextCharacter = this.peekChar
      if (nextCharacter === null) {
        throw new Error('Expected end of date')
      }
      if (nextCharacter === '#') break
      completeLiteral += nextCharacter
      this.nextChar()
    }

    if (this.nextChar() !== '#') {
      throw new Error('not a date end')
    }
    return {
      type: 'date',
      value: completeLiteral,
    }
  }

  private string(): Token {
    const stringStartChar = this.nextChar()
    if (stringStartChar !== "'" && stringStartChar !== '"') {
      throw new Error('not a string start')
    }
    let contents = ''

    let withinEscape = false

    while (true) {
      const nextCharacter = this.peekChar
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
      this.nextChar()
    }

    if (this.nextChar() !== stringStartChar) {
      throw new Error('not a string end')
    }

    return { type: 'string', value: contents }
  }

  private number(): Token {
    const completeLiteralStart = this.index
    let completeLiteralLength = 0
    while (true) {
      const nextCharacter = this.peekChar
      if (nextCharacter === null || !isNumber(nextCharacter)) break
      completeLiteralLength++
      this.nextChar()
    }

    if (this.peekChar === '.') {
      this.nextChar()
      completeLiteralLength++
    }

    while (true) {
      const nextCharacter = this.peekChar
      if (nextCharacter === null || !isNumber(nextCharacter)) break
      completeLiteralLength++
      this.nextChar()
    }

    const exponent: string | null = this.peekChar
    if (exponent === 'e') {
      this.nextChar()
      completeLiteralLength++

      if (this.peekChar === '-') {
        this.nextChar()
        completeLiteralLength++
      } else if (this.peekChar === '+') {
        this.nextChar()
        completeLiteralLength++
      }

      while (true) {
        const nextCharacter = this.peekChar
        if (nextCharacter === null || !isNumber(nextCharacter)) break
        completeLiteralLength++
        this.nextChar()
      }
    }

    return {
      type: 'number',
      value: this.input.slice(
        completeLiteralStart,
        completeLiteralStart + completeLiteralLength,
      ),
    }
  }

  private operator(): Token {
    const operator = this.nextChar()
    if (operator === null) throw new Error(`unrecognised input '${operator}'`)

    const nextCharacter = this.peekChar
    if (
      (operator === '>' && nextCharacter === '=') ||
      (operator === '<' && nextCharacter === '=') ||
      (operator === '=' && nextCharacter === '=') ||
      (operator === '!' && nextCharacter === '=') ||
      (operator === '&' && nextCharacter === '&') ||
      (operator === '>' && nextCharacter === '>') ||
      (operator === '<' && nextCharacter === '<') ||
      (operator === '<' && nextCharacter === '>') ||
      (operator === '*' && nextCharacter === '*') ||
      (operator === '|' && nextCharacter === '|')
    ) {
      this.nextChar()
      const token = {
        type: operator + nextCharacter,
        value: operator + nextCharacter,
      }
      return token as Token
    }
    const token = {
      type: operator,
      value: operator,
    }
    return token as Token
  }

  private groupOpen(): Token {
    this.nextChar()
    return { type: 'group-open', value: '(' }
  }

  private groupClose(): Token {
    this.nextChar()
    return { type: 'group-close', value: ')' }
  }

  private separator(): Token {
    this.nextChar()
    return { type: 'separator', value: ',' }
  }

  private identifier(): Token {
    let identifier = ''
    let nextCharacter = this.peekChar
    while (nextCharacter !== null && isIdentifier(nextCharacter)) {
      identifier += nextCharacter
      this.nextChar()
      nextCharacter = this.peekChar
    }

    const lowerIdentifier = identifier.toLowerCase()

    if (lowerIdentifier === 'false' || lowerIdentifier === 'true') {
      return {
        type: 'boolean',
        value: lowerIdentifier,
      }
    }

    if (lowerIdentifier === 'not' || lowerIdentifier === 'in') {
      return { type: lowerIdentifier, value: lowerIdentifier }
    }

    if (lowerIdentifier === 'or') {
      return { type: '||', value: lowerIdentifier }
    }

    if (lowerIdentifier === 'and') {
      return { type: '&&', value: lowerIdentifier }
    }

    return { type: 'identifier', value: identifier }
  }

  private parameter(): Token {
    const openToken = this.nextChar()

    let closeToken = ']'
    if (openToken === '{') closeToken = '}'

    let name = ''
    let nextCharacter = this.peekChar
    while (nextCharacter !== closeToken && nextCharacter !== null) {
      name += nextCharacter
      this.nextChar()
      nextCharacter = this.peekChar
    }

    if (this.nextChar() !== closeToken)
      throw new Error(`Expected ${closeToken}`)

    return { type: 'parameter', value: name }
  }
}

function isNumberStart(s: string): boolean {
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
    case '.':
      return true
  }
  return false
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
  return s === '[' || s === '{'
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
    case '%':
    case '|':
    case '&':
      return true
  }
  return false
}

function isWhitespace(s: string): boolean {
  return [' ', '\n', '\t', '\r'].includes(s)
}
