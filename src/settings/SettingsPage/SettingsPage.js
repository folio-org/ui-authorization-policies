import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  useAuthorizationPolicies,
  useUsers,
  PolicyDetails,
  SearchForm,
} from '@folio/stripes-authorization-components';
import {
  Button,
  MultiColumnList,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  COLUMN_MAPPING,
  getResultsFormatter,
  VISIBLE_COLUMNS,
} from './constanta';

const propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  affiliationSelectionComponent: PropTypes.node,
  tenantId: PropTypes.string,
};

const SettingsPage = ({ affiliationSelectionComponent, tenantId, match:{ path } }) => {
  const { id: policyId } = useParams();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const lastMenu = (
    <PaneMenu>
      <Button buttonStyle="primary" marginBottom0>
        + <FormattedMessage id="ui-authorization-policies.new" />
      </Button>
    </PaneMenu>
  );

  const {
    policies,
    isLoading,
    refetch,
  } = useAuthorizationPolicies({ searchTerm, tenantId });
  const { users } = useUsers(policies.map(i => i.metadata.updatedByUserId));

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    refetch();
  };

  const formatter = useMemo(() => getResultsFormatter({ users, path }), [users, path]);

  const selectedPolicy = useMemo(() => policies.find(i => i.id === policyId), [policies, policyId]);
  return (
    <Paneset>
      <Pane
        defaultWidth="fill"
        renderHeader={() => (
          <PaneHeader
            lastMenu={lastMenu}
            paneTitle={
              <FormattedMessage id="ui-authorization-policies.meta.title" />
            }
          />
        )}
      >
        {affiliationSelectionComponent}
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearchSubmit}
          searchLabelId="ui-authorization-policies.search"
        />
        <MultiColumnList
          columnMapping={COLUMN_MAPPING}
          contentData={policies}
          formatter={formatter}
          loading={isLoading}
          visibleColumns={VISIBLE_COLUMNS}
        />
      </Pane>
      {selectedPolicy && <PolicyDetails policy={selectedPolicy} onClose={() => history.push(path)} />}
    </Paneset>
  );
};

SettingsPage.propTypes = propTypes;

export default SettingsPage;
