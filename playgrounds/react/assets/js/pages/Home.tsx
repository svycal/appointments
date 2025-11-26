import React, { ReactNode } from 'react';
import { RootLayout } from '../layouts/root-layout';
import { usePublicServiceSlots } from '@savvycal/appointments-react-query';

const Home = () => {
  const { data, isLoading } = usePublicServiceSlots('srv_2cd153f28244', {
    from: '2025-11-26',
    until: '2025-12-26',
  });

  return (
    <div>
      <h1>Home</h1>
      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
