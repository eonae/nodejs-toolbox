import { getSequence } from '../src/get-sequence.function';

const array = [1, 2, 3, 4];
const START = 0;
const END = 3;

describe('should pick correct slices', () => {

  describe('straight', () => {
    test('START -> MIDDLE', () => {
      const result = getSequence(array, START, 1);
      expect(result).toEqual([1, 2]);
    });
  
    test('MIDDLE -> END', () => {
      const result = getSequence(array, 2, END);
      expect(result).toEqual([3, 4]);
    })
  
    test('MIDDLE -> MIDDLE', () => {
      const result = getSequence(array, 1, 2);
      expect(result).toEqual([2, 3]);
    })
  
    test('START -> END', () => {
      const result = getSequence(array, START, END);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('reversed', () => {
    test('MIDDLE -> START', () => {
      const result = getSequence(array, 1, START);
      expect(result).toEqual([2, 1]);
    });
  
    test('END -> MIDDLE', () => {
      const result = getSequence(array, END, 2);
      expect(result).toEqual([4, 3]);
    })
  
    test('MIDDLE -> MIDDLE', () => {
      const result = getSequence(array, 2, 1);
      expect(result).toEqual([3, 2]);
    })
  
    test('END -> START', () => {
      const result = getSequence(array, END, START);
      expect(result).toEqual([4, 3, 2, 1]);
    });
  })
});
