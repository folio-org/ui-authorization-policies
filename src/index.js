import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route } from 'react-router-dom';
import Settings from './settings';

const App = (props) => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-policies');

  return (
    <Suspense>
      <Switch>
        <Route path={`${props.match.path}/:id?`} render={() => <Settings {...props} />} />
      </Switch>
    </Suspense>
  );
};

App.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  })
};

export default App;
