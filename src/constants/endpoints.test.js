import { POLICIES_ENDPOINT } from './endpoints';

describe('Endpoints', function () {
  it('test url for policies', () => {
    expect(POLICIES_ENDPOINT()).toBe('policies?limit=1000&query=cql.allRecords=1 sortby name');
    expect(POLICIES_ENDPOINT('searchTest')).toBe(
      'policies?limit=1000&query=name=*searchTest* sortby name'
    );
  });
});
