import { createContext, useContext, useReducer, useMemo } from "react";

export const StateContext = createContext(null);

const StateProvider = ({ children, initialState, reducer }) => {
	const setValue = useReducer(reducer, initialState);
	return <StateContext.Provider value={setValue}>{children}</StateContext.Provider>;
};

export const useStateProvider = () => useContext(StateContext);

export default StateProvider;
