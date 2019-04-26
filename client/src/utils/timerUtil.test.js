import { convertSecToMinSecStr } from './timeUtil';

describe('convertSecToMinSecStr: Test timer convertion', () => {
  it('Should handle valid time', () => {
    expect(convertSecToMinSecStr(140)).toBe('02:20');
    expect(convertSecToMinSecStr(719)).toBe('11:59');
    expect(convertSecToMinSecStr(0)).toBe('00:00');
  });

  it('should return time when min > 60', () => {
    expect(convertSecToMinSecStr(5005)).toBe('83:25');
  });

  it('Should accept numbers passed as string', () => {
    expect(convertSecToMinSecStr('719')).toBe('11:59');
  });
});
