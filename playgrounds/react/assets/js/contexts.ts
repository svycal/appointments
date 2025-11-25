import { createContext } from 'react';
import { createClient } from '@savvycal/appointments-react-query';

export const SavvyCalContext = createContext(createClient({}));
