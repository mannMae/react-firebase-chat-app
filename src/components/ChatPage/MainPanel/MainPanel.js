import { useEffect, useState } from 'react';
import { Message } from './Message';
import { MessageForm } from './MessageForm';
import { MessageHeader } from './MessageHeader';
import { child, get, onChildAdded, ref } from 'firebase/database';
import { firebaseDatabase } from '../../../firebase';
import { useSelector } from 'react-redux';

export const MainPanel = () => {
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);

  const messagesRef = ref(firebaseDatabase, 'messages');

  useEffect(() => {
    if (chatRoom?.id) {
      get(child(messagesRef, chatRoom.id)).then((res) => {
        let currentMessages = [];
        if (res.val()) {
          currentMessages = Object.values(res.val());
        }
        setMessages(currentMessages);
        setIsFirstLoaded(true);
      });
    }
  }, [chatRoom]);

  useEffect(() => {
    if (chatRoom?.id) {
      addMessagesListeners(chatRoom.id);
    }
  }, [isFirstLoaded, chatRoom]);

  const addMessagesListeners = (chatRoomId) => {
    let newMessages = [];
    onChildAdded(child(messagesRef, chatRoomId), (data) => {
      newMessages.push(data.val());
    });
    setMessages(newMessages);
    setIsMessageLoading(false);
  };

  return (
    <div style={{ padding: '2rem 2rem 0 2rem' }}>
      <MessageHeader />

      <div
        style={{
          width: '100%',
          height: '450px',
          border: '0.2rem solid #ececec',
          padding: '1rem',
          marginBottom: '1rem',
          overflowY: 'auto',
        }}
      >
        {messages.map((message, i) => (
          <Message
            key={message.timeStamp}
            message={message}
            user={message.user}
          />
        ))}
      </div>

      <MessageForm />
    </div>
  );
};
