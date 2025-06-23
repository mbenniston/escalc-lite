

## Logical expression

The root expression

```ts
<!-- @include: ../src/parse.ts{8,13} -->
```

## Ternary expression

Represents a logical `?` expression.

```ts
<!-- @include: ../src/parse.ts{15,20} -->
```

## Binary expression

Represents an expression that takes two arguments. 

```ts
<!-- @include: ../src/parse.ts{22,48} -->
```

## Unary expression

Represents an expression that takes a single argument. Such as negation.

```ts
<!-- @include: ../src/parse.ts{50,54} -->
```

## Value expression

Represents a single value, could be a parameter or a constant.

```ts
<!-- @include: ../src/parse.ts{56,62} -->
```

## Function expression

Represents a call to a function which can accept any number of arguments.

```ts
<!-- @include: ../src/parse.ts{64,68} -->
```
