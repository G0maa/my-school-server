// Unit tests for the utils/helpers.ts file
import { Paginate } from '../utils/helpers';

// This was made with the help of Github Copilot
describe('Paginate() function unit tests', () => {
  test('should return an object with offset and limit', () => {
    const obj = Paginate({ page: 1, size: 10 });

    expect(obj).toHaveProperty('offset');
    expect(obj).toHaveProperty('limit');

    expect(obj.offset).toBe(0);
    expect(obj.limit).toBe(10);
  });
});
