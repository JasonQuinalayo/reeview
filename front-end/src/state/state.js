import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  user: null,
  questions: {
    ee: [],
    esas: [],
    math: [],
  },
};

export const StateContext = createContext([
  initialState,
  () => initialState,
]);

export const StateProvider = ({
  reducer,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
