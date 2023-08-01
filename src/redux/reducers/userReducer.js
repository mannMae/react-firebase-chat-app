import { SET_USER } from '../actions/types';

const initailUserState = {
  currentUser: null,
  isLoading: true,
};

export const user = (state = initailUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
