import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { keyBy } from 'lodash';

import useUsers, { chunkedUsersReducer } from './useUsers';

const userData = {
  'items': [
    {
      'username': 'aapple',
      'id': 'a1',
      'active': true,
      'type': 'staff',
      'personal': {
        'lastName': 'Andrea',
        'firstName': 'Apple',
        'middleName': 'A'
      },
    },
    {
      'username': 'bblick',
      'id': 'b2',
      'active': true,
      'type': 'staff',
      'personal': {
        'lastName': 'Bethany',
        'firstName': 'Blick',
        'middleName': 'B'
      }
    }
  ],
  'totalRecords': 2,
  'resultInfo': {
    'totalRecords': 2
  }
};

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useChunkedCQLFetch: () => ({
    items: userData,
    isLoading: false,
  }),
  useNamespace: () => ['namespace'],
  useOkapiKy: () => ({
    get: () => ({
      items: userData,
      isLoading: false,
    })
  })
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUsers', () => {
  it('fetches users', async () => {
    const { result } = renderHook(() => useUsers(['a', 'b']), { wrapper });
    await act(() => !result.current.isLoading);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.users).toMatchObject(keyBy(userData.users, 'id'));
  });
});

describe('chunkedUsersReducer', () => {
  it('assembles chunks', () => {
    const list = [
      { data: { users: [1, 2, 3] } },
      { data: { users: [4, 5, 6] } },
    ];

    const result = chunkedUsersReducer(list);
    expect(result.length).toBe(6);
  });
});

