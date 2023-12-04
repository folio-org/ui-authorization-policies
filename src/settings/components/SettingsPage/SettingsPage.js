import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, FormattedDate } from 'react-intl';

import {
  Pane,
  PaneHeader,
  Paneset,
  Button,
  PaneMenu,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { UserName } from '@folio/stripes/smart-components';

import useAuthorizationPolicies from '../../../hooks/useAuthorizationPolicies';
import { SearchForm } from '../SearchForm';
import { PolicyDetails } from '../PolicyDetails';

const propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

const SettingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const onRowClick = (_event, row) => setSelectedRow(row);

  const { connect } = useStripes();

  const ConnectedUserName = connect(UserName);

  const lastMenu = (
    <PaneMenu>
      <Button buttonStyle="primary" marginBottom0>
        + <FormattedMessage id="ui-authorization-policies.new" />
      </Button>
    </PaneMenu>
  );

  const { policies, isLoading, refetch } = useAuthorizationPolicies({ searchTerm });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    refetch();
  };

  const resultsFormatter = {
    name: (item) => <TextLink>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata.modifiedBy ? (
      <TextLink>
        <ConnectedUserName id={item.metadata.modifiedBy} />
      </TextLink>
    ) : (
      '-'
    )),
    updated: (item) => (item.metadata.modifiedDate ? (
      <FormattedDate value={item.metadata.modifiedDate} />
    ) : (
      '-'
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
