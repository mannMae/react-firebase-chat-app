import { useEffect, useState } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { firebaseDatabase } from '../../../firebase';
import { onChildAdded, ref } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/actions/chatRoomAction';

export const DirectMessages = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );

  const [users, setUsers] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState();
  const usersRef = ref(firebaseDatabase, 'users');

  const addUsersListeners = (currentUserId) => {
    let usersArray = [];
    onChildAdded(usersRef, (data) => {
      if (currentUserId !== data.key) {
        let user = data.val();
        user['uid'] = data.key;
        user['status'] = 'offline';
        usersArray.push(user);
        setUsers([...usersArray]);
      }
    });
  };

  useEffect(() => {
    addUsersListeners(currentUser?.uid);
  }, []);

  const changeChatRoom = (user) => {
    const chatRoomId = getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    dispatch(setCurrentChatRoom(chatRoomData));
    dispatch(setPrivateChatRoom(true));
    setActiveChatRoom(chatRoomId);
  };

  const getChatRoomId = (userId) => {
    const currentUserId = currentUser.uid;

    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <FaRegSmile /> DIRECT MESSAGES (1)
      </span>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {users.map((user, i) => (
          <li
            key={i}
            onClick={() => changeChatRoom(user)}
            style={{
              cursor: 'pointer',
              backgroundColor:
                currentChatRoom?.id === activeChatRoom && '#ffffff45',
              transition: 'all ease 0.3s 0s',
            }}
          >
            # {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
