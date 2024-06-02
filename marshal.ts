import { defineMarshalUnit, morph, pass } from '@kiruse/marshal';
import { Decimal } from './index';

const rxDecimal = /^[+-]?\d+(\.\d+)?$/;

export const DecimalMarshalUnit = defineMarshalUnit(
  (value) => value instanceof Decimal ? morph(value.toString()) : pass,
  (value) => typeof value === 'string' && rxDecimal.test(value) ? morph(Decimal.parse(value)) : pass,
);
