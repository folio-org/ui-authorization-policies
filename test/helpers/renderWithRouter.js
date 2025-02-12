import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';

const history = createMemoryHistory();
const renderWithRouter = children => (
  <Router history={history}>
    <IntlProvider
      locale="en"
      messages={{}}
    >
      {children}
    </IntlProvider>
  </Router>
);

export default renderWithRouter;
