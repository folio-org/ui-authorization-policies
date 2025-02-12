import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import App from '.';

jest.mock('@k-int/stripes-kint-components', () => ({
  useIntlKeyStore: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('./settings', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="mocked-settings-page">Settings Page</div>
    )),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: '/settings',
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

describe('App component', () => {
  it('calls the addKey of useIntlKeyStore function with the correct namespace', () => {
    render(<App match={{ path:'/settings' }} />, { wrapper });
    expect(useIntlKeyStore()).toHaveBeenCalledWith('ui-authorization-policies');
  });

  it('renders settings page', () => {
    const { getByTestId } = render(<App match={{ path:'/settings' }} />, { wrapper });
    expect(getByTestId('mocked-settings-page')).toBeInTheDocument();
  });
});
