import { CLEAR_USER, SET_PHOTO_URL, SET_USER } from '../actions/types';

const initialUserState = {
  currentUser: null,
  isLoading: true,
};

export const user = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    case CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    case SET_PHOTO_URL:
      return {
        currentUser: { ...state.currentUser, photoURL: action.payload },
        isLoading: false,
      };
    default:
      return state;
  }
};
