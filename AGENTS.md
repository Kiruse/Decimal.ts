# AGENTS.md - Developer Guidelines for @kiruse/decimal

## Project Overview

This is a simple BigInt-based decimal library for financial applications. The codebase consists of:

- `index.ts` - Main Decimal class implementation
- `marshal.ts` - Marshalling integration with @kiruse/marshal
- `inspectable.js` - Node.js console inspection helper
- `test.js` - Bun test suite

## Commands

### Build/Compile

```bash
npm run prepare    # Compile TypeScript (also runs on npm install)
npm run prepack    # Compile before packaging
```

These both execute `tsc` to compile `index.ts` and `marshal.ts` to CommonJS in the same directory.

### Testing

```bash
npm test           # Run all tests: bun test ./test.js
bun test ./test.js # Direct bun test invocation

# Run a single test by name
bun test ./test.js -t "Decimal#constructor"
bun test ./test.js -t "Decimal arithmetic"
bun test ./test.js -t "Decimal parse"
```

No additional lint or typecheck commands are defined. TypeScript compilation happens via `tsc` in build scripts.

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2020
- Module: CommonJS
- Declaration and sourceMap enabled
- No allowJs (TypeScript only)

### General Style

- No semicolons at line endings
- Use backticks for template strings
- Use single quotes for string literals (except template strings)
- 2-space indentation (TypeScript default)

### Classes

- Use private class fields (`#value`, `#decimals`)
- Use getter properties for public access (`get value()`, `get decimals()`)
- Create alias getters where appropriate (`get int() { return this.integer }`)

### Naming Conventions

- PascalCase for class names: `Decimal`, `DecimalMarshalUnit`
- camelCase for methods and properties: `add()`, `sub()`, `toString()`
- Private fields prefixed with `#`: `#value`, `#decimals`
- Constants in camelCase: `rxDecimal` (regular expression)

### Imports

- Use relative imports: `import { Decimal } from './index'`
- Use named imports: `import { defineMarshalUnit, morph, pass } from '@kiruse/marshal'`

### Method Return Types

- Omit return types when they are inferrable (TypeScript will infer)
- Include explicit return types for static methods and exported functions when ambiguous

### Error Handling

- Throw `Error` with descriptive messages
- Example: `throw new Error(\`Invalid Decimal JSON: ${JSON.stringify(json)}\`)`

### JSDoc Comments

- Use JSDoc for public API documentation
- Example:
  ```typescript
  /** Rebase precision, returning a new `Decimal` instance (unless decimals are unchanged).
   * Decreasing precision can lead to loss of information.
   */
  rebase(decimals: number) { ... }
  ```

### JSON Serialization

- Use `$` prefix for custom JSON markers: `{ $decimal: { value, decimals } }`
- Implement `toJSON()` and static `fromJSON()` for serializable types

### Static Factory Methods

- Use `static` factory methods like `parse()` and `fromJSON()` instead of multiple constructors
- Support overload signatures for different input types:
  ```typescript
  static parse(value: bigint, decimals: number): Decimal;
  static parse(value: string | number | bigint | Decimal): Decimal;
  static parse(value: bigint | string | number | Decimal, decimals?: number) { ... }
  ```

### Arithmetic Operations

- Return new Decimal instances (immutable operations)
- Use BigInt arithmetic: `10n ** BigInt(n)`
- Handle decimal precision alignment in operations like `add()`, `sub()`, `div()`

### Comparison Methods

- Explicit boolean return types: `lt(other: Decimal): boolean`
- Methods: `equals()`, `lt()`, `lte()`, `gt()`, `gte()`

### Testing with Bun

- Use `bun:test` framework: `import { expect, test } from 'bun:test'`
- Test file must be `.js` (JavaScript, not TypeScript) when using Bun
- Group related assertions: `expect(...).toEqual(...)` for objects, `toBe(...)` for primitives
- Use descriptive test names: `test('Decimal#constructor')`, `test('Decimal arithmetic')`

### Conditional Node.js/Runtime Checks

- Use `typeof process !== 'undefined'` for Node.js specific code
- Use `//@ts-ignore` comment when requiring JS from TS

## Common Patterns

### Property Getters

```typescript
get value() { return this.#value; }
get int() { return this.integer }
get integer() { return this.#value / 10n ** BigInt(this.decimals); }
```

### Parsing with Regex

```typescript
let matches = value.match(/^(\d+)?\.(\d+)$/i);
if (matches) {
  const [_, int = 0, frac] = matches;
  return new Decimal(BigInt(int + frac), frac.length);
}
```

### BigInt String Conversion

```typescript
value.toString()  // Convert BigInt to string for JSON
BigInt(value)      // Parse string/number to BigInt
```
