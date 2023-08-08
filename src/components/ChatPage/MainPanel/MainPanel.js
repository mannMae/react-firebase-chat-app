import { useEffect, useState } from 'react';
import { Message } from './Message';
import { MessageForm } from './MessageForm';
import { MessageHeader } from './MessageHeader';
import {
  child,
  get,
  off,
  onChildAdded,
  onChildRemoved,
  ref,
} from 'firebase/database';
import { firebaseDatabase } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts } from '../../../redux/actions/chatRoomAction';

export const MainPanel = () => {
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const [eventListeners, setEventListeners] = useState([]);

  const messagesRef = ref(firebaseDatabase, 'messages');
  const typingRef = ref(firebaseDatabase, 'typing');

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
      addTypingListeners(chatRoom.id);
    }

    return () => removeEventListener(eventListeners);
  }, [isFirstLoaded, chatRoom]);

  const addMessagesListeners = (chatRoomId) => {
    let newMessages = [];
    onChildAdded(child(messagesRef, chatRoomId), (data) => {
      newMessages.push(data.val());
      setMessages([...newMessages]);
    });
    userPostsCount(messages);

    setIsMessageLoading(false);
  };

  const userPostsCount = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (acc[message.user.name]) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    dispatch(setUserPosts(userPosts));
  };
  //

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
    handleSearchMessages();
  };

  const handleSearchMessages = () => {
    const chatRoomMessages = [...messages];
    const regex = new RegExp(searchTerm, 'gi');
    const newSearchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(newSearchResults);
  };

  const [typingUsers, setTypingUsers] = useState([]);

  const addTypingListeners = (chatRoomId) => {
    let newTypingUsers = [];
    onChildAdded(child(typingRef, chatRoomId), (data) => {
      if (data.key !== currentUser.uid) {
        newTypingUsers.push({
          id: data.key,
          name: data.val(),
        });
        setTypingUsers([...newTypingUsers]);
      }
    });

    addEventListener(chatRoomId, typingRef, 'child_added');

    onChildRemoved(child(typingRef, chatRoomId), (data) => {
      console.log(data.key);
      if (data.key !== currentUser.id) {
        console.log(newTypingUsers);
        newTypingUsers = newTypingUsers.filter((user, i) => {
          console.log(user);
          console.log(data.key);
          console.log(user.id === data.key);
          return user.id !== data.key;
        });
      }
      console.log(newTypingUsers);
      setTypingUsers([...newTypingUsers]);
    });

    addEventListener(chatRoomId, typingRef, 'child_removed');
  };

  const addEventListener = (chatRoomId, ref, eventType) => {
    const index = eventListeners.findIndex((listener) => {
      return (
        listener.chatRoomId === chatRoomId &&
        listener.ref === ref &&
        listener.eventType === eventType
      );
    });

    if (index === -1) {
      const newLintener = { chatRoomId, ref, eventType };
      setEventListeners((prev) => [...prev, newLintener]);
    }
  };

  const removeEventListener = (listeners) => {
    listeners.forEach((listener) => {
      off(child(listener.ref, listener.chatRoomId), listener.eventType);
    });
  };

  return (
    <div style={{ padding: '2rem 2rem 0 2rem' }}>
      <MessageHeader handleSearchChange={handleSearchChange} />

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
        {searchTerm
          ? searchResults.map((message, i) => {
              return (
                <Message
                  key={message.timeStamp}
                  message={message}
                  user={message.user}
                />
              );
            })
          : messages.map((message, i) => {
              return (
                <Message
                  key={message.timeStamp}
                  message={message}
                  user={currentUser}
                />
              );
            })}
        {typingUsers.length === 1 ? (
          typingUsers.map((user, i) => (
            <span key={i}>{user.name}님이 채팅을 입력하고 있습니다...</span>
          ))
        ) : typingUsers.length > 1 ? (
          <span>{`${typingUsers[0].name}님 외 ${
            typingUsers.length - 1
          }명이 채팅을 입력하고 있습니다...`}</span>
        ) : null}
      </div>

      <MessageForm />
    </div>
  );
};
