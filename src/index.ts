import { evaluate, evaluateSafe } from './evaluate'
import { execute, executeSafe } from './execute'
import { format, formatSafe } from './format'
import { parameters, parametersSafe } from './parameters'
import { parse, parseSafe } from './parse'

export const ESCalcLite = {
  parse,
  parseSafe,
  evaluate,
  evaluateSafe,
  execute,
  executeSafe,
  format,
  formatSafe,
  parameters,
  parametersSafe,
}

export * from './evaluate'
export * from './format'
export * from './parameters'
export * from './parse'
