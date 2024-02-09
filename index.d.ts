export declare class Decimal {
    #private;
    constructor(value?: bigint | number, decimals?: number);
    /** Rebase precision, returning a new `Decimal` instance (unless decimals are unchanged).
     * Decreasing precision can lead to loss of information.
     */
    rebase(decimals: number): Decimal;
    add(other: Decimal): Decimal;
    sub(other: Decimal): Decimal;
    mul(other: Decimal): Decimal;
    div(other: Decimal): Decimal;
    equals(other: Decimal): boolean;
    lt(other: Decimal): boolean;
    lte(other: Decimal): boolean;
    gt(other: Decimal): boolean;
    gte(other: Decimal): boolean;
    toString(): string;
    toShortString(): string;
    toJSON(): {
        $decimal: {
            value: string;
            decimals: number;
        };
    };
    valueOf(): bigint;
    static fromJSON(json: any): Decimal;
    static parse(value: string | number | bigint): Decimal;
    get value(): bigint;
    get int(): bigint;
    get integer(): bigint;
    get frac(): bigint;
    get fraction(): bigint;
    get decimals(): number;
}
