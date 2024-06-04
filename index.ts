
export class Decimal {
  #value: bigint;
  #decimals: number;

  constructor(value: bigint | number = 0, decimals = 0) {
    this.#value = BigInt(value);
    this.#decimals = decimals;
  }

  /** Rebase precision, returning a new `Decimal` instance (unless decimals are unchanged).
   * Decreasing precision can lead to loss of information.
   */
  rebase(decimals: number) {
    if (decimals === this.decimals)
      return this;
    if (decimals < this.decimals)
      return new Decimal(this.value / 10n ** BigInt(this.decimals - decimals), decimals);
    return new Decimal(this.value * 10n ** BigInt(decimals - this.decimals), decimals);
  }

  add(other: Decimal) {
    const base = Math.max(this.decimals, other.decimals);
    return new Decimal(this.rebase(base).value + other.rebase(base).value, base);
  }

  sub(other: Decimal) {
    const base = Math.max(this.decimals, other.decimals);
    return new Decimal(this.rebase(base).value - other.rebase(base).value, base);
  }

  mul(other: Decimal) {
    return new Decimal(this.value * other.value, this.decimals + other.decimals);
  }

  div(other: Decimal) {
    return new Decimal(this.value * (10n ** BigInt(other.decimals)) / other.value, this.decimals);
  }

  equals(other: Decimal) {
    const base = Math.max(this.decimals, other.decimals);
    return this.rebase(base).value === other.rebase(base).value;
  }
  lt(other: Decimal): boolean {
    const base = Math.max(this.decimals, other.decimals);
    return this.rebase(base).value < other.rebase(base).value;
  }
  lte(other: Decimal): boolean {
    const base = Math.max(this.decimals, other.decimals);
    return this.rebase(base).value <= other.rebase(base).value;
  }
  gt(other: Decimal): boolean {
    const base = Math.max(this.decimals, other.decimals);
    return this.rebase(base).value > other.rebase(base).value;
  }
  gte(other: Decimal): boolean {
    const base = Math.max(this.decimals, other.decimals);
    return this.rebase(base).value >= other.rebase(base).value;
  }

  toString() {
    return this.decimals ? `${this.int}.${this.frac.toString().padStart(this.decimals, '0')}` : `${this.int}`;
  }

  toShortString() {
    const int = this.value / 10n ** BigInt(this.decimals);
    const dec = this.value % 10n ** BigInt(this.decimals);
    if (int === 0n) {
      const leadingZeros = this.decimals - dec.toString().length;
      if (leadingZeros > 0) {
        const sdec = dec.toString();
        if (leadingZeros > 3)
          return `${sdec[0]}.${sdec.slice(1, 4)}e-${leadingZeros + 1}`;
        return `.${'0'.repeat(leadingZeros)}${dec}`;
      }
      return dec.toString();
    }

    if (int < 1000n)
      return int + '';
    if (int < 1000000n)
      return `${int / 1000n}k`;
    if (int < 1000000000n)
      return `${int / 1000000n}M`;
    if (int < 1000000000000n)
      return `${int / 1000000000n}B`;
    return `${int / 1000000000000n}T`;
  }

  toJSON() {
    return {
      $decimal: {
        value: this.value.toString(),
        decimals: this.decimals,
      },
    };
  }

  valueOf() {
    return this.value;
  }

  static fromJSON(json: any) {
    if (!json || typeof json !== 'object' || !('$decimal' in json))
      throw new Error(`Invalid Decimal JSON: ${JSON.stringify(json)}`);
    const { value, decimals } = json.$decimal;
    return new Decimal(BigInt(value), decimals);
  }

  static parse(value: string | number | bigint) {
    if (typeof value === 'bigint') {
      return new Decimal(value);
    }

    value = (value+'').trim();
    if (value.match(/^[+-]?\d+$/))
      return new Decimal(BigInt(value));
    if (value.match(/^[+-]?\d+k$/i))
      return new Decimal(BigInt(value.slice(0, -1)) * 1000n);
    if (value.match(/^[+-]?\d+m$/i))
      return new Decimal(BigInt(value.slice(0, -1)) * 1000000n);
    if (value.match(/^[+-]?\d+b$/i))
      return new Decimal(BigInt(value.slice(0, -1)) * 1000000000n);
    if (value.match(/^[+-]?\d+t$/i))
      return new Decimal(BigInt(value.slice(0, -1)) * 1000000000000n);

    // decimals
    let matches = value.match(/^(\d+)?\.(\d+)$/i);
    if (matches) {
      const [_, int = 0, frac] = matches;
      return new Decimal(BigInt(int + frac), frac.length);
    }

    // very small decimals
    matches = value.match(/^[+-]?0?\.0\((\d+)\)\s*(\d+)$/i);
    if (matches) {
      const [_, precision, amount] = matches;
      return new Decimal(BigInt(amount), Number(precision)+1);
    }

    return new Decimal(-1n);
  }

  get value() {
    return this.#value;
  }
  get int() { return this.integer }
  get integer() {
    return this.#value / 10n ** BigInt(this.decimals);
  }
  get frac() { return this.fraction }
  get fraction() {
    const tmp = this.#value % 10n ** BigInt(this.decimals);
    return tmp < 0n ? -tmp : tmp;
  }
  get decimals() {
    return this.#decimals;
  }
}

//@ts-ignore
if (typeof require === 'function') require('./inspectable')(Decimal);
