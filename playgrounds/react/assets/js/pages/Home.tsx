import React, { useContext } from 'react';
import { SavvyCalContext } from '../contexts';

const Home = () => {
  const client = useContext(SavvyCalContext);

  client.useQuery('get', '/v1/account');

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
