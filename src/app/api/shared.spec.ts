import { parseDates } from './shared';

describe('parseDates', () => {
  it('converts string dates to Date objects', () => {
    const input = {
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
      name: 'sample',
    };

    const result = parseDates(input);

    expect(result).not.toBe(input as unknown as typeof result);
    expect(result.createdAt).toEqual(new Date('2020-01-01T00:00:00Z'));
    expect(result.updatedAt).toEqual(new Date('2020-01-02T00:00:00Z'));
    expect(result.name).toBe('sample');
  });
});
