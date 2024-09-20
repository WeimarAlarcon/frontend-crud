import { describe, it, expect } from 'vitest';

function myFunction(a: number, b: number) {
  return a + b;
}

describe('myFunction', () => {
  it('should return the correct result', () => {
    expect(myFunction(2, 3)).toBe(5);
  });
});
