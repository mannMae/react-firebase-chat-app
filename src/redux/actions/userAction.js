import { CLEAR_USER, SET_PHOTO_URL, SET_USER } from './types';

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};

export const setPhotoUrl = (image) => {
  return {
    type: SET_PHOTO_URL,
    payload: image,
  };
};
