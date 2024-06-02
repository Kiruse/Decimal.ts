import { expect, test } from 'bun:test';
import { Decimal } from './index';
import { extendDefaultMarshaller } from '@kiruse/marshal';
import { DecimalMarshalUnit } from './marshal';

test('Decimal#constructor', () => {
  const d = new Decimal(123456789n, 6);
  expect(d.value).toBe(123456789n);
  expect(d.int).toBe(123n);
  expect(d.frac).toBe(456789n);
  expect(d.decimals).toBe(6);
});

test('Decimal#rebase', () => {
  {
    const d = new Decimal(123456789n, 6).rebase(8);
    expect(d.value).toBe(12345678900n);
    expect(d.int).toBe(123n);
    expect(d.frac).toBe(45678900n);
  }

  {
    const d = new Decimal(12345678900n, 8).rebase(6);
    expect(d.value).toBe(123456789n);
    expect(d.int).toBe(123n);
    expect(d.frac).toBe(456789n);
  }
});

test('Decimal arithmetic', () => {
  const d1 = Decimal.parse('2.3');
  const d2 = Decimal.parse('3.45');
  expect(d1.add(d2).toString()).toEqual('5.75');
  expect(d1.sub(d2).toString()).toEqual('-1.15');
  expect(d1.mul(d2).toString()).toEqual('7.935');
  expect(d1.rebase(6).div(d2).toString()).toEqual('0.666666');
});

test('Decimal#to(Short)String', () => {
  expect(new Decimal(123456789n, 6).toString()).toBe('123.456789');
  expect(new Decimal(123456789n, 6).toShortString()).toBe('123');
  expect(new Decimal(1234n, 0).toShortString()).toBe('1k');
  expect(new Decimal(1234567n, 0).toShortString()).toBe('1M');
  expect(new Decimal(1234567890n, 0).toShortString()).toBe('1B');
  expect(new Decimal(1234567890000n, 0).toShortString()).toBe('1T');
  expect(new Decimal(123n, 6).toShortString()).toBe('.000123');
  expect(new Decimal(123456n, 18).toShortString()).toBe('1.234e-13');
});

test('Decimal to/fromJSON', () => {
  const d1 = new Decimal(123456789n, 6);
  const d2 = Decimal.fromJSON(d1.toJSON());
  expect(d2.value).toBe(d1.value);
});

test('Decimal parse', () => {
  expect(Decimal.parse(0.05).toString()).toBe('0.05');
  expect(Decimal.parse('0.05').toString()).toBe('0.05');
  expect(Decimal.parse('.0000005').toString()).toBe('0.0000005');
  expect(Decimal.parse('123.456789').toString()).toBe('123.456789');
  expect(Decimal.parse('.0(5)5').toString()).toBe('0.000005');

  expect(Decimal.parse('10k').toString()).toBe('10000');
  expect(Decimal.parse('10K').toString()).toBe('10000');
  expect(Decimal.parse('10m').toString()).toBe('10000000');
  expect(Decimal.parse('10M').toString()).toBe('10000000');
  expect(Decimal.parse('10b').toString()).toBe('10000000000');
  expect(Decimal.parse('10B').toString()).toBe('10000000000');
  expect(Decimal.parse('10t').toString()).toBe('10000000000000');
  expect(Decimal.parse('10T').toString()).toBe('10000000000000');
});

test('Marshal Unit', () => {
  const marshaller = extendDefaultMarshaller([DecimalMarshalUnit]);
  const d = new Decimal(123456789n, 6);
  expect(marshaller.marshal(d)).toBe('123.456789');
  expect(marshaller.unmarshal('123.456789')).toEqual(d);
});
