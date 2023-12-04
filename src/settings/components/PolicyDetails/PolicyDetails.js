import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  ExpandAllButton,
  AccordionStatus,
  Pane,
  KeyValue,
  MetaSection,
  NoValue
} from '@folio/stripes/components';

import { UserName } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

import css from '../../style.css';

const PolicyDetails = ({ policy, onClose }) => {
  const { connect } = useStripes();

  const ConnectedUserName = connect(UserName);

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={policy.name}
      onClose={onClose}
      dismissible
    >
      <AccordionStatus>
        <div className={css.alignRightWrapper}>
          <ExpandAllButton />
        </div>
        <AccordionSet>
          <Accordion
            label={
              <FormattedMessage id="ui-authorization-policies.generalInformation" />
            }
          >
            <MetaSection
              id="policyMetadataId"
              contentId="policyMetadata"
              headingLevel={4}
              createdDate={policy.metadata?.createdDate}
              lastUpdatedDate={policy.metadata?.modifiedDate}
              lastUpdatedBy={
                <ConnectedUserName id={policy.metadata?.modifiedBy} />
              }
              createdBy={<ConnectedUserName id={policy.metadata?.createdBy} />}
            />
            <KeyValue
              data-testid="policy-name"
              label={
                <FormattedMessage id="ui-authorization-policies.columns.name" />
              }
              value={policy.name}
            />
            <KeyValue
              data-testid="policy-description"
              label={
                <FormattedMessage id="ui-authorization-policies.columns.description" />
              }
              value={policy?.description ?? <NoValue />}
            />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

PolicyDetails.propTypes = {
  policy: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PolicyDetails;
