# escalc-lite (Preview)

An Opinionated NCalc expression evaluator in TypeScript. Exposes parsers and a tree walk evaluator for a subset of the
NCalc expression language.

Designed to be a fast small footprint implementation and zero dependencies. 

## Implementation

Created using a recursive descent parser with a handwritten lexer and tree walk evaluator.

## Support matrix

Table of supported and unsupported features (name, not yet implemented, wont implement)

- Cache = won't implement, caching can be done by the user in a way that makes sense for them.
- GUID value type = won't implement, use a string.

## Equivalent NCalc flags

## Overriding evaluation behaviour

Override provided calculator and literal value factory classes.

Encouraged to traverse the tree manually for custom behaviour.

## License

[MIT](./LICENSE) License © 2025 [mbenniston](https://github.com/mbenniston)
