# @kiruse/decimal

BigInt-based decimal implementation for financial applications. Provides precise decimal arithmetic without floating-point errors.

## Installation

```bash
npm install @kiruse/decimal
```

## Usage

### Construction

Create `Decimal` using the constructor or `Decimal.parse`:

```typescript
import { Decimal } from '@kiruse/decimal';

// Constructor: value is bigint, decimals is the precision
new Decimal(42);           // 42 with 0 precision
new Decimal(42000000n, 6); // 42.000000 with 6 decimals precision
new Decimal(42).rebase(6); // 42.000000 with 6 decimals precision

// Parse from string, number, or bigint
Decimal.parse('0.01');             // 0.01 with 2 precision
Decimal.parse(0.01);               // 0.01 with 2 precision (via stringification)
Decimal.parse('0.010000');         // 0.010000 with 6 precision
```

### Arithmetic Operations

```typescript
import { Decimal } from '@kiruse/decimal';

const a = Decimal.parse('10.50');
const b = Decimal.parse('3.25');

a.add(b);  // 13.75 - uses higher precision (2)
a.sub(b);  // 7.25
a.mul(b);  // 34.125 - combines precisions (2 + 2 = 4)

// Division is lossy - rebase first for more precision
a.div(b);  // 3.23 (uses a's precision)
a.rebase(4).div(b); // 3.2307
```

### Comparison

```typescript
Decimal.parse('10.00').equals(Decimal.parse('10')); // true
Decimal.parse('1.00').lt(Decimal.parse('2.00'));     // true
Decimal.parse('1.00').lte(Decimal.parse('1.00'));     // true
Decimal.parse('2.00').gt(Decimal.parse('1.00'));      // true
Decimal.parse('2.00').gte(Decimal.parse('2.00'));    // true
```

### Accessing Values

```typescript
const dec = Decimal.parse('123.456');

// Full value as bigint
dec.value;   // 123456n
dec.valueOf(); // 123456n

// Integer part only
dec.int;     // 123n
dec.integer; // 123n

// Fractional part only
dec.frac;    // 456n
dec.fraction; // 456n
dec.decimals; // 3
```

### Rebasing Precision

```typescript
const dec = Decimal.parse('1.5'); // 1.5 with 1 precision

// Increase precision - adds trailing zeros
dec.rebase(4); // 1.5000 with 4 precision

// Decrease precision - truncates (loss of data)
new Decimal(123456, 6).rebase(3); // 0.123 with 3 precision
```

### Stringification

```typescript
const dec = Decimal.parse('1234567.89');

dec.toString();      // "1234567.89"
dec.toShortString(); // "1M" (compressed format)

// Compressed format for small numbers:
// 0.0(n)X where (n) = number of leading zeros after decimal
Decimal.parse('0.0000049').toShortString(); // "0.0(5)49"
```

### JSON Support

```typescript
const dec = Decimal.parse('42.50');

// Serialize to JSON
JSON.stringify(dec);
// { "$decimal": { "value": "4250", "decimals": 2 } }

// Deserialize from JSON
const restored = Decimal.fromJSON(json);
```

## API

### Constructor

`new Decimal(value?: bigint | number, decimals?: number)` - Create a decimal. If providing a plain number, ensure you specify the correct decimals.

### Static Methods

- `Decimal.parse(value: string | number | bigint | Decimal): Decimal` - Parse from various input types
- `Decimal.fromJSON(json: any): Decimal` - Deserialize from JSON object

### Instance Methods

- `decimal.rebase(decimals: number): Decimal` - Change precision
- `decimal.add(other: Decimal): Decimal` - Addition
- `decimal.sub(other: Decimal): Decimal` - Subtraction
- `decimal.mul(other: Decimal): Decimal` - Multiplication
- `decimal.div(other: Decimal): Decimal` - Division (lossy)
- `decimal.equals(other: Decimal): boolean` - Equality check
- `decimal.lt(other: Decimal): boolean` - Less than
- `decimal.lte(other: Decimal): boolean` - Less than or equal
- `decimal.gt(other: Decimal): boolean` - Greater than
- `decimal.gte(other: Decimal): boolean` - Greater than or equal
- `decimal.toString(): string` - Full decimal string
- `decimal.toShortString(): string` - Compressed format
- `decimal.toJSON(): object` - JSON representation
- `decimal.valueOf(): bigint` - Raw bigint value

### Instance Properties

- `decimal.value` / `decimal.valueOf()` - Raw bigint
- `decimal.int` / `decimal.integer` - Integer part
- `decimal.frac` / `decimal.fraction` - Fractional part
- `decimal.decimals` - Precision

## License

Apache 2.0
