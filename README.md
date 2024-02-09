# @kiruse/decimal
Just a simple reusable but biased dependency-less implementation of Big Decimal numbers for financial applications that I personally use in different projects.

## Usage
### Construction
There's 2 main ways to construct `Decimal`s: using the constructor, or using the `Decimal.parse` method.

Using the constructor:
```typescript
import { Decimal } from '@kiruse/decimal';

new Decimal();             //  0, with 0 precision
new Decimal(42);           // 42, with 0 precision
new Decimal(42000000n, 6); // 42.000000, with 6 decimals precision
new Decimal(42).rebase(6); // 42.000000, with 6 decimals precision
```
When using the constructor you must specify how many decimals the given number or bigint has. Alternatively, as shown by the last variant, you may call `.rebase` to calculate the digit shift, which is most useful when creating integers that will be used in subsequent operations.

Using `Decimal.parse`:
```typescript
import { Decimal } from '@kiruse/decimal';

Decimal.parse(0.01);             // 0.01, with 2 precision (stringifies the number)
Decimal.parse(1n);               // 1, with 0 precision (stringifies the bigint)
Decimal.parse('0.01');           // 0.01, with 2 precision
Decimal.parse('0.01').rebase(6); // 0.010000, with 6 precision
Decimal.parse('0.010000');       // 0.010000, with 6 precision
```

### JSON Support
The `Decimal` type comes with a `.toJSON()` method and its equivalent counterpart `Decimal.fromJSON()` to marshal and unmarshal to JSON primitives. The resulting JSON object will look like this:
```json
{
  "$decimal": {
    "value": "<bigint_value>",
    "decimals": 6
  }
}
```

### Values
For financial applications unaware of any decimal precision, you may call `decimal.valueOf()` or `decimal.value`.

Use `decimal.int` or `decimal.integer` to get only the integer part of your decimal.

Use `decimal.frac`, `decimal.fraction`, or `decimal.decimals` to get only the fractional part of your decimal.

### Rebasing precision
Call `decimal.rebase(newPrecision)` to create a new `Decimal` with the given increased or decreased precision. If the precision is unchanged, returns the same instance to avoid unnecessary operations.

When changing precision, the underlying bigint value is changed by the corresponding powers of ten. Thus, decreasing precision will cause loss of information. For example, `new Decimal(123456, 6).rebase(3)` will reduce 0.123456 to 0.123.

### Arithmetics
Additional `.add`, subtraction `.sub`, and multiplication `.mul` combine the precisions to prevent loss of information. Both `.add` and `.sub` will use the higher precision of the two decimals for the result. `.mul` will combine the precisions.

However, `.div` is almost always a lossy operation as there are more irrational numbers than rational numbers. Thus. `.div` simply uses the same precision as the first decimal. For example, `new Decimal(123456, 3).div(new Decimal(42))` will result in 2.939 rather than 2.939428571. If you require more precision be sure to `.rebase` before `.div`.

### Comparison
Currently supports 5 arithmetic comparisons: `.equals`, `.lt`, `.lte`, `.gt`, and `.gte`. All comparisons rebase to the higher precision between the two `Decimal`s. Due to the `.rebase` logic, when comparing many decimals, the algorithm is fastest when all decimals already use the same precision, although differences in performance should be negligible for most applications.

### Stringification
For visualizing the number, use `decimal.toString()` or `decimal.toShortString()`. The former will print numbers in a simple format without thousand separators, while the latter will compress large numbers by simplifying to M(illion), B(illion) or T(rillion). Very small numbers are compressed by contracting zeroes to something like `0.0(5)49`, where the number in parantheses indicates how many total 0s follow the decimal period, such that `0.0(5)49` is equivalent to `0.0000049`.

# License
Apache 2.0
