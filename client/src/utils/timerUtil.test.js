import { convertSecToMinSecStr } from './timeUtil';

describe('convertSecToMinSecStr: Test timer convertion', () => {
  it('Should handle valid time', () => {
    expect(convertSecToMinSecStr(140).toBe('02:20'));
    expect(convertSecToMinSecStr(719)).toBe('11:59');
    expect(convertSecToMinSecStr(0)).toBe('00:00');
  });

  // TODO: test negative cases after test framework is integrated.
  // Also, need to discuss with team on expected behaviour of below cases.
  // handles number > 60 minutes'
  // handles empty string, null, undefined input.
  // handles negative numbers.
  // handles number passed as string
});
