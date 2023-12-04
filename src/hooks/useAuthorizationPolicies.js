import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { POLICIES_ENDPOINT } from '../constants';

const useAuthorizationPolicies = ({ searchTerm, options }) => {
  const ky = useOkapiKy();

  const [nameSpace] = useNamespace({ key: 'ui-authorization-policies' });

  const { data, isLoading, refetch } = useQuery(
    [nameSpace],
    () => ky(POLICIES_ENDPOINT(searchTerm)).json(),
    { enabled: true, ...options }
  );

  return {
    policies: data?.policies || [],
    isLoading,
    refetch,
  };
};

export default useAuthorizationPolicies;
