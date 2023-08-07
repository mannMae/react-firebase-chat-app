import { useEffect, useState } from 'react';
import { Message } from './Message';
import { MessageForm } from './MessageForm';
import { MessageHeader } from './MessageHeader';
import { child, get, onChildAdded, ref } from 'firebase/database';
import { firebaseDatabase } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts } from '../../../redux/actions/chatRoomAction';

export const MainPanel = () => {
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const dispatch = useDispatch();
  // const [userPostsCount, setUserPostsCount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
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
      setMessages([...newMessages]);
    });
    userPostsCount(messages);

    setIsMessageLoading(false);
  };

  const userPostsCount = (messages) => {
    console.log(messages);
    let userPosts = messages.reduce((acc, message) => {
      console.log(acc, message);
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
      </div>

      <MessageForm />
    </div>
  );
};
