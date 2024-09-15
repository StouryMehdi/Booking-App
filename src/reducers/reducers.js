// src/reducers/index.js
import { combineReducers } from 'redux'; // Import combineReducers

const initialState = {
  times: [], // Ensure this is an array
};

const timeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES':
      // Ensure payload is an array
      return { ...state, times: Array.isArray(action.payload) ? action.payload : [] };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  time: timeReducer,
  // Add other reducers here if needed
});

export default rootReducer;