import { Suspense } from 'react';

import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import Settings from './settings';

const App = (props) => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-policies');

  return (
    <Suspense>
      <Settings {...props} />
    </Suspense>
  );
};

export default App;
