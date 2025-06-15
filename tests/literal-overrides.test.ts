import Decimal from 'decimal.js'
import { expect, test } from 'vitest'
import { Expression } from '../src'
import {
  DefaultLiteralFactory,
  type Literal,
} from '../src/internal/literal-factory'

import {
  DefaultValueCalculator,
  type ExpressionParameter,
} from '../src/internal/value-calculator'

class DecimalLiteralFactory extends DefaultLiteralFactory {
  create(value: Literal): unknown {
    if (value.type === 'number') {
      return new Decimal(value.value)
    }
    return super.create(value)
  }
}

class DecimalCalculator extends DefaultValueCalculator {
  add(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (leftValue instanceof Decimal && rightValue instanceof Decimal) {
      return leftValue.add(rightValue)
    }
    return super.add(left, right)
  }

  div(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (leftValue instanceof Decimal && rightValue instanceof Decimal) {
      return leftValue.div(rightValue)
    }
    return super.div(left, right)
  }

  mul(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (leftValue instanceof Decimal && rightValue instanceof Decimal) {
      return leftValue.mul(rightValue)
    }
    return super.mul(left, right)
  }

  negate(left: ExpressionParameter): unknown {
    const leftValue = left.evaluate()

    if (leftValue instanceof Decimal) {
      return leftValue.neg()
    }
    return super.negate(left)
  }

  sub(left: ExpressionParameter, right: ExpressionParameter): unknown {
    const leftValue = left.evaluate()
    const rightValue = right.evaluate()

    if (leftValue instanceof Decimal && rightValue instanceof Decimal) {
      return leftValue.sub(rightValue)
    }
    return super.sub(left, right)
  }
}

test('custom decimal with builtin overrides', () => {
  const expression = new Expression('Sin(3)', {
    literalFactory: new DecimalLiteralFactory(),
  })
  expression.Calculator = new DecimalCalculator()
  expression.EvaluateFunctions.Sin = (args, options) => {
    const arg = args[0].evaluate()
    if (arg instanceof Decimal) {
      return arg.sin()
    }

    return Expression.BuiltIns.Sin(args, options)
  }
  const result = expression.Evaluate()
  if (!(result instanceof Decimal)) throw new Error('Expected decimal argument')

  expect(result.toSD(15).toString()).toBe('0.141120008059867')
})

test('evaluate with complex expression', () => {
  const expression = new Expression(
    '(((([a]+([b]*([c]-[d]/([e]+[f]))))-(([g]+[h])*([i]-([j]/([k]+[l]-[m])))))+([n]*([o]+[p]-([q]*[r]/([s]+[t])))))/((([u]+[v])*([w]-[x]+([y]/([z]+[aa]))))+([ab]-[ac]+([ad]/([ae]+[af]-[ag])))))+(([ah]*([ai]+[aj]-([ak]/([al]+[am]))))-(([an]+[ao])/([ap]-[aq]+[ar]))+[as])',
    {
      literalFactory: new DecimalLiteralFactory(),
    },
  )
  expression.Calculator = new DecimalCalculator()
  expression.Parameters = {
    ['a']: new Decimal(2),
    ['b']: new Decimal(3),
    ['c']: new Decimal(14),
    ['d']: new Decimal(6),
    ['e']: new Decimal(1),
    ['f']: new Decimal(1),
    ['g']: new Decimal(5),
    ['h']: new Decimal(2),
    ['i']: new Decimal(20),
    ['j']: new Decimal(8),
    ['k']: new Decimal(1),
    ['l']: new Decimal(2),
    ['m']: new Decimal(1),
    ['n']: new Decimal(4),
    ['o']: new Decimal(7),
    ['p']: new Decimal(5),
    ['q']: new Decimal(2),
    ['r']: new Decimal(6),
    ['s']: new Decimal(1),
    ['t']: new Decimal(1),
    ['u']: new Decimal(5),
    ['v']: new Decimal(5),
    ['w']: new Decimal(30),
    ['x']: new Decimal(10),
    ['y']: new Decimal(6),
    ['z']: new Decimal(2),
    ['aa']: new Decimal(1),
    ['ab']: new Decimal(40),
    ['ac']: new Decimal(10),
    ['ad']: new Decimal(18),
    ['ae']: new Decimal(2),
    ['af']: new Decimal(1),
    ['ag']: new Decimal(1),
    ['ah']: new Decimal(3),
    ['ai']: new Decimal(9),
    ['aj']: new Decimal(6),
    ['ak']: new Decimal(10),
    ['al']: new Decimal(2),
    ['am']: new Decimal(3),
    ['an']: new Decimal(7),
    ['ao']: new Decimal(3),
    ['ap']: new Decimal(10),
    ['aq']: new Decimal(2),
    ['ar']: new Decimal(2),
    ['as']: new Decimal(5),
  }

  const result = expression.Evaluate()
  if (!(result instanceof Decimal)) throw new Error('Expected decimal argument')

  expect(result.toSD(15).toString()).toBe('42.7953667953668')
})
