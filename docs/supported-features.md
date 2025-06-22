ESCalc Lite supports a subset of the full NCalc syntax.

## Literals

| Name    | Example                |
|---------|------------------------|
| Numeric | `1.23e2`               |
| Boolean | `false \| true`        |
| String  | `'string' \| "string"` |
| Date    | `#12/12/1995#`         |

## Operators

| Operator | Description                    |
|----------|--------------------------------|
| `+`      | Addition                       |
| `-`      | Subtraction                    |
| `*`      | Multiplication                 |
| `**`     | Exponentiation                 |
| `/`      | Division                       |
| `%`      | Modulus (remainder)            |
| `>`      | Greater than                   |
| `<`      | Less than                      |
| `>=`     | Greater than or equal to       |
| `<=`     | Less than or equal to          |
| `==`     | Equality comparison            |
| `=`      | Equality comparison            |
| `!=`     | Not equal                      |
| `<>`     | Not equal                      |
| `!`      | Logical NOT                    |
| `&&`     | Logical AND                    |
| `\|\|`   | Logical OR                     |
| `&`      | Bitwise AND                    |
| `\|`     | Bitwise OR                     |
| `^`      | Bitwise XOR                    |
| `>>`     | Bitwise right shift            |
| `<<`     | Bitwise left shift             |
| `~`      | Bitwise NOT                    |
| `?`      | Ternary conditional operator   |
| `in`     | Checks if value is in list     |
| `not`    | Logical NOT                    |
| `not in` | Checks if value is not in list |


## Builtin functions

| Name            | Description                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------|
| `Abs`           | Returns the absolute value of a number.                                                                            |
| `Acos`          | Returns the arccosine (in radians) of a number.                                                                    |
| `Asin`          | Returns the arcsine (in radians) of a number.                                                                      |
| `Atan`          | Returns the arctangent (in radians) of a number.                                                                   |
| `Ceiling`       | Rounds a number up to the nearest integer.                                                                         |
| `Cos`           | Returns the cosine of a number (in radians).                                                                       |
| `Exp`           | Returns *e* raised to the power of a number.                                                                       |
| `Floor`         | Rounds a number down to the nearest integer.                                                                       |
| `IEEERemainder` | Returns the remainder according to IEEE 754 rules.                                                                 |
| `Ln`            | Returns the natural logarithm (base *e*) of a number.                                                              |
| `Log`           | Returns the logarithm of a number with optional custom base. Defaults to natural log if base not provided.         |
| `Log10`         | Returns the base-10 logarithm of a number.                                                                         |
| `Max`           | Returns the larger of two numbers.                                                                                 |
| `Min`           | Returns the smaller of two numbers.                                                                                |
| `Pow`           | Raises a number to the power of another.                                                                           |
| `Round`         | Rounds a number to the nearest integer or to a specified number of decimal places.                                 |
| `Sign`          | Returns the sign of a number (-1, 0, or 1).                                                                        |
| `Sin`           | Returns the sine of a number (in radians).                                                                         |
| `Sqrt`          | Returns the square root of a number.                                                                               |
| `Tan`           | Returns the tangent of a number (in radians).                                                                      |
| `Truncate`      | Truncates a number by removing its fractional part.                                                                |
| `if`            | Evaluates and returns one of two values based on a boolean condition.                                              |
| `ifs`           | Evaluates multiple conditions and returns the result of the first true condition; returns a default if none match. |
