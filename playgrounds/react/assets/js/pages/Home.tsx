import React, { useContext, ReactNode } from 'react';
import { SavvyCalContext } from '../contexts';
import { RootLayout } from '../layouts/root-layout';

const Home = () => {
  const savvyCalClient = useContext(SavvyCalContext);

  savvyCalClient.useQuery('get', '/v1/account');

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
