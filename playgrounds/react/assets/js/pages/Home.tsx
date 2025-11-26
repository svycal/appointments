import React, { useContext, ReactNode } from 'react';
import { SavvyCalContext } from '../contexts';
import { RootLayout } from '../layouts/root-layout';

const Home = () => {
  const savvyCalClient = useContext(SavvyCalContext);

  savvyCalClient.useQuery('get', '/v1/public/services/{service_id}/slots', {
    params: {
      path: { service_id: 'srv_28f3a4bd5986' },
      query: { from: '2025-11-26', until: '2025-12-26' },
    },
  });

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
