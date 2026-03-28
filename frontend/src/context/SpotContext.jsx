import { createContext, useContext } from 'react';

export const SpotContext = createContext(null);
export const useSpot = () => useContext(SpotContext);