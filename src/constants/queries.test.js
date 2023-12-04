import { likeSearch } from './queries';

describe('Queries utils', function () {
  it('test like search', () => {
    expect(likeSearch('searchTest')).toBe(
      '*searchTest*'
    );
  });
});
