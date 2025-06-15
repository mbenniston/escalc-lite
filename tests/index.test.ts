import { expect, test } from 'vitest'
import { Expression } from '../src'

test('test ', () => {
  const e = new Expression('#12/11/2003#')
  expect(e.Evaluate()).toStrictEqual(new Date(2003, 11, 11))
})

test('test escape ', () => {
  const es = String.raw`"hello\\ worlds"`
  console.log(es)
  const e = new Expression(es)
  expect(e.Evaluate()).toStrictEqual(String.raw`hello\ worlds`)
})

test('test builtins ', () => {
  const e = new Expression('Max(7,4,6)')
  expect(e.Evaluate()).toStrictEqual(7)
})

test('operators ', () => {
  const e = new Expression(
    '((5 << 1) == 10 && (12 >> 2) == 3) || !(7 & 1 == 1 && (4 | 1) == 5) || (6 ^ 3) == 5',
  )
  expect(e.Evaluate()).toStrictEqual(true)
})

test('test date comparison', () => {
  const e = new Expression(
    '#2024-06-15# >= #2024-06-01# && #2024-06-15# <= #2024-12-31#',
  )
  expect(e.Evaluate()).toStrictEqual(true)
})

test('test complex2', () => {
  const ast = new Expression(
    'Max(Abs([a]-Sqrt([b]*[c])),Sin([d]+[e])*Cos([f]-[g]),([h]+[i])^2/Log([j]+10),Min([k],[l]+[m]*2),Log(Sqrt(Abs([n]-[o]+Min([p],[q])))))+Sqrt(Abs([r]-[s]/Max([t],1)))',
  )
  ast.Parameters = {
    ['a']: 25,
    ['b']: 4,
    ['c']: 9,
    ['d']: Math.PI / 2,
    ['e']: 0,
    ['f']: 0,
    ['g']: 0,
    ['h']: 2,
    ['i']: 3,
    ['j']: 5,
    ['k']: 20,
    ['l']: 6,
    ['m']: 2,
    ['n']: 18,
    ['o']: 4,
    ['p']: 3,
    ['q']: 10,
    ['r']: 20,
    ['s']: 5,
    ['t']: 0,
  }
  expect(ast.Evaluate()).toBeCloseTo(22.873, 3)
})
