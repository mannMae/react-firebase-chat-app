import {
  DataSnapshot,
  child,
  get,
  onChildAdded,
  onValue,
  push,
  ref,
  update,
} from 'firebase/database';
import { useEffect, useState } from 'react';
import { Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseDatabase } from '../../../firebase';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/actions/chatRoomAction';

export const ChatRooms = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const chatRoomsRef = ref(firebaseDatabase, 'chatRooms');
  const isFormValid = () => name && description;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      addChatRoom();
    }
  };

  const addChatRoom = async () => {
    const newKey = push(chatRoomsRef).key;
    const newChatRoom = {
      id: newKey,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await update(child(chatRoomsRef, newKey), newChatRoom);
      setName('');
      setDescription('');
      setShow(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [chatRoomsArray, setChatRoomsArray] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState('');
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );

  useEffect(() => {
    get(chatRoomsRef).then((res) => {
      const currentChatRooms = Object.values(res.val());
      if (currentChatRooms.length === 0) {
        return;
      }
      setChatRoomsArray([...currentChatRooms]);
      dispatch(setCurrentChatRoom(currentChatRooms[0]));
      setActiveChatRoom({ ...currentChatRooms[0] });
      setIsFirstLoaded(true);
    });
  }, []);

  useEffect(() => {
    addChatRoomsListeners(currentChatRoom.id);
  }, [isFirstLoaded]);

  const addChatRoomsListeners = (currentChatRoomId) => {
    let newChatRooms = [];
    onChildAdded(chatRoomsRef, (data) => {
      newChatRooms.push(data.val());
      setChatRoomsArray([...newChatRooms]);
      addNotificationListener(data.key, currentChatRoomId);
    });
  };

  const changeChatRoom = (chatRoom) => {
    dispatch(setCurrentChatRoom(chatRoom));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoom({ ...chatRoom });
    clearNotifications(chatRoom);
    addChatRoomsListeners(chatRoom.id);
  };

  //
  const [notifications, setNotifications] = useState([]);
  const messagesRef = ref(firebaseDatabase, 'messages');

  const addNotificationListener = (chatRoomId, currentChatRoomId) => {
    onValue(child(messagesRef, chatRoomId), (data) => {
      if (currentChatRoom) {
        handleNotification(chatRoomId, currentChatRoomId, notifications, data);
      }
    });
  };

  const handleNotification = (
    chatRoomId,
    currentChatRoomId,
    notifications,
    data
  ) => {
    let index = notifications.findIndex(
      (notification) => notification.id === chatRoomId
    );

    let lastTotal = 0;

    if (index === -1 || chatRoomId === currentChatRoomId) {
      notifications.push({
        id: chatRoomId,
        total: data.size,
        lastKnownTotal: data.size,
        count: 0,
      });
    } else {
      if (chatRoomId !== currentChatRoomId) {
        lastTotal = notifications[index].lastKnownTotal;

        if (data.size - lastTotal > 0) {
          notifications[index].count = data.size - lastTotal;
        }
      }
      notifications[index].total = data.size;
    }

    setNotifications([...notifications]);
  };

  const getNotificationCount = (chatRoomId) => {
    let count = 0;

    notifications.forEach((notification) => {
      if (notification.id === chatRoomId) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  const clearNotifications = (chatRoom) => {
    let index = notifications.findIndex(
      (notification) => notification.id === chatRoom.id
    );

    if (index !== -1) {
      let updatedNotification = [...notifications];
      updatedNotification[index].lastKnownTotal = notifications[index].total;
      updatedNotification[index].count = 0;
      setNotifications([...updatedNotification]);
    }
  };

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS ({chatRoomsArray.length})
        <FaPlus
          onClick={handleShow}
          style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
        />
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a chat room name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>방 설명</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ul
        style={{
          listStyleType: 'none',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        {chatRoomsArray.map((chatRoom, i) => (
          <li
            key={i}
            onClick={() => changeChatRoom(chatRoom)}
            style={{
              cursor: 'pointer',
              backgroundColor:
                chatRoom.id === currentChatRoom?.id && '#ffffff45',
              transition: 'all ease 0.3s 0s',
              display: 'flex',
              gap: '5px',
            }}
          >
            # {chatRoom.name}
            <Badge bg="danger">{getNotificationCount(chatRoom.id)}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
};
