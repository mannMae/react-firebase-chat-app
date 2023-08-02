import { combineReducers } from 'redux';
import { user } from './userReducer';
import { chatRoom } from './chatRoomReducer';

export const rootReducer = combineReducers({
  user,
  chatRoom,
});
