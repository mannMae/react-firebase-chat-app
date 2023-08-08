import { child, onChildAdded, onChildRemoved, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { firebaseDatabase } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/actions/chatRoomAction';

export const Favorited = () => {
  const dispatch = useDispatch();
  const userRef = ref(firebaseDatabase, 'users');
  const { currentUser } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const [favoritedRooms, setFavoritedRooms] = useState([]);

  useEffect(() => {
    addListeners();
  }, []);

  const addListeners = () => {
    if (!currentUser?.uid) {
      return;
    }

    let newFavoritedRooms = [];
    onChildAdded(
      child(child(userRef, currentUser.uid), 'favorited'),
      (data) => {
        const room = data.val();
        room['id'] = data.key;
        newFavoritedRooms.push(room);
        setFavoritedRooms([...newFavoritedRooms]);
      }
    );

    onChildRemoved(
      child(child(userRef, currentUser.uid), 'favorited'),
      (data) => {
        newFavoritedRooms = newFavoritedRooms.filter((room, i) => {
          return room.id !== data.key;
        });
        setFavoritedRooms([...newFavoritedRooms]);
      }
    );
  };

  const changeChatRoom = (chatRoom) => {
    dispatch(setCurrentChatRoom(chatRoom));
    dispatch(setPrivateChatRoom(false));
  };
  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegSmileBeam style={{ marginRight: '3px' }} />
        FAVORITED ({favoritedRooms.length})
      </span>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {favoritedRooms.map((room, i) => {
          console.log(room);
          return (
            <li
              key={i}
              onClick={() => changeChatRoom(room)}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  room?.id === currentChatRoom?.id && '#ffffff45',
              }}
            >
              # {room.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
