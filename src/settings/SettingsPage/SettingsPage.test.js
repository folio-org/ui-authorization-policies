import { renderWithIntl } from '@folio/stripes-erm-testing';

import { cleanup } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useAuthorizationPolicies } from '@folio/stripes-authorization-components';

import translationsProperties from '../../../test/helpers/translationsProperties';
import SettingsPage from './SettingsPage';

jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useAuthorizationPolicies: jest.fn().mockReturnValue({
    policies: [
      {
        id: 'id',
        name: 'Test Policy',
        description: 'policy description in free form',
        metadata: {
          updatedDate: '2023-03-14T13:11:59.601+00:00',
        },
      },
    ],
  }),
  useUsers: jest.fn().mockReturnValue({
    users: [],
  }),
  PolicyDetails: jest.fn(() => <div data-testid="mock-policy-details">Policy details pane</div>),
  SearchForm: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useChunkedCQLFetch: () => ({
    items: [],
    isLoading: false,
  }),
  useNamespace: () => ['namespace'],
}));

describe('SettingsPage', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the SettingsPage component', () => {
    const { getByText } = renderWithIntl(
      <SettingsPage match={{ path: '/authorization-policies' }} />,
      translationsProperties
    );

    expect(getByText('+ New')).toBeInTheDocument();
    expect(getByText('Test Policy')).toBeInTheDocument();
    expect(getByText('3/14/2023')).toBeInTheDocument();
    expect(getByText('policy description in free form')).toBeInTheDocument();
  });

  it('renders policy details on click', async () => {
    useAuthorizationPolicies.mockImplementationOnce(() => ({
      policies: [
        {
          id: 'id',
          name: 'Test policy',
          description: 'Test policy description',
          metadata: {},
        },
      ],
    }));
    const { queryByTestId, getAllByRole } = renderWithIntl(
      <SettingsPage match={{ path: '/authorization-policies' }} />,
      translationsProperties
    );
    await userEvent.click(getAllByRole('gridcell')[0]);
    expect(queryByTestId('mock-policy-details')).toBeInTheDocument();
  });

  it('should render Affiliation selection component', () => {
    const { getByText } = renderWithIntl(
      <SettingsPage
        match={{ path: '/authorization-policies' }}
        affiliationSelectionComponent={<div>Test Affiliation Selection Component</div>}
      />,
      translationsProperties
    );

    expect(getByText('Test Affiliation Selection Component')).toBeInTheDocument();
  });
});
