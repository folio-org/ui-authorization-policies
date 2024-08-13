import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, FormattedDate } from 'react-intl';

import {
  Button,
  MultiColumnList,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  TextLink,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import useAuthorizationPolicies from '../../../hooks/useAuthorizationPolicies';
import useUsers from '../../../hooks/useUsers';
import { SearchForm } from '../SearchForm';
import { PolicyDetails } from '../PolicyDetails';

const propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  affiliationSelectionComponent: PropTypes.node,
  tenantId: PropTypes.string,
};

const SettingsPage = ({ affiliationSelectionComponent, tenantId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const onRowClick = (_event, row) => setSelectedRow(row);

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

  const resultsFormatter = {
    name: (item) => <TextLink>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata.updatedByUserId ? getFullName(users[item.metadata.updatedByUserId]) : (
      <NoValue />
    )),
    updated: (item) => (item.metadata.updatedDate ? (
      <FormattedDate value={item.metadata.updatedDate} />
    ) : (
      <NoValue />
    )),
  };

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
        />
        <MultiColumnList
          columnMapping={{
            name: (
              <FormattedMessage id="ui-authorization-policies.columns.name" />
            ),
            description: (
              <FormattedMessage id="ui-authorization-policies.columns.description" />
            ),
            updated: (
              <FormattedMessage id="ui-authorization-policies.columns.updatedDate" />
            ),
            updatedBy: (
              <FormattedMessage id="ui-authorization-policies.columns.updatedBy" />
            ),
          }}
          contentData={policies}
          formatter={resultsFormatter}
          selectedRow={selectedRow}
          onRowClick={onRowClick}
          loading={isLoading}
          visibleColumns={['name', 'description', 'updated', 'updatedBy']}
        />
      </Pane>
      {selectedRow && <PolicyDetails policy={selectedRow} onClose={() => setSelectedRow(null)} />}
    </Paneset>
  );
};

SettingsPage.propTypes = propTypes;

export default SettingsPage;
