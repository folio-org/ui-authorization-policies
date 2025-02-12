import { axe, toHaveNoViolations } from 'jest-axe';
import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import React from 'react';
import SettingsPage from './SettingsPage';
import { renderWithRouter } from '../../../test/helpers';

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

jest.mock('react-router-dom', () => {
  return { ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ id: 'id' }) };
});


describe('SettingsPage', () => {
  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders the SettingsPage component', () => {
    const { getByText } = render(renderWithRouter(<SettingsPage match={{ path:'authorization-policies/id' }} />));
    expect(getByText(/ui-authorization-policies.new/)).toBeInTheDocument();
    expect(getByText('3/14/2023')).toBeInTheDocument();
    expect(getByText('policy description in free form')).toBeInTheDocument();
    expect(getByText('Policy details pane')).toBeInTheDocument();
  });

  it('should render Affiliation selection component', () => {
    const { getByText } = render(renderWithRouter(<SettingsPage affiliationSelectionComponent={<div>Test Affiliation Selection Component</div>} match={{ path:'authorization-policies/id' }} />));

    expect(getByText('Test Affiliation Selection Component')).toBeInTheDocument();
  });

  it('has no a11y violations according to axe', async () => {
    expect.extend(toHaveNoViolations);

    const { container } = render(
      renderWithRouter(<SettingsPage
        match={{ path: '/authorization-policies' }}
        affiliationSelectionComponent={<div>Test Affiliation Selection Component</div>}
      />)
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
