import {
  DataSnapshot,
  child,
  get,
  onChildAdded,
  push,
  ref,
  update,
} from 'firebase/database';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseDatabase } from '../../../firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoomAction';

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
  const [activeChatRoomId, setActiveChatRoomId] = useState('');
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const chatRooms = useSelector((state) => state.chatRoom);

  useEffect(() => {
    get(chatRoomsRef).then((res) => {
      const currentChatRooms = Object.values(res.val());
      if (currentChatRooms.length === 0) {
        return;
      }
      setChatRoomsArray([...currentChatRooms]);
      dispatch(setCurrentChatRoom(currentChatRooms[0]));
      setActiveChatRoomId(currentChatRooms[0].id);
      setIsFirstLoaded(true);
    });
  }, []);

  useEffect(() => {
    addChatRoomsListeners();
  }, [isFirstLoaded]);

  const addChatRoomsListeners = () => {
    let newChatRooms = [];
    onChildAdded(chatRoomsRef, (data) => {
      newChatRooms.push(data.val());
      setChatRoomsArray(newChatRooms);
    });
  };

  const changeChatRoom = (chatRoom) => {
    dispatch(setCurrentChatRoom(chatRoom));
    setActiveChatRoomId(chatRoom.id);
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
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {chatRoomsArray.map((chatRoom, i) => (
          <li
            key={i}
            onClick={() => changeChatRoom(chatRoom)}
            style={{
              cursor: 'pointer',
              backgroundColor: chatRoom.id === activeChatRoomId && '#ffffff45',
              transition: 'all ease 0.3s 0s',
            }}
          >
            # {chatRoom.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
