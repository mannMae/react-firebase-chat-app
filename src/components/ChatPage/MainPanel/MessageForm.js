import { child, ref, serverTimestamp, set, push } from 'firebase/database';
import { useState } from 'react';
import { Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { firebaseDatabase } from '../../../firebase';
import { useSelector } from 'react-redux';

export const MessageForm = () => {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageRef = ref(firebaseDatabase, 'messages');
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timeStamp: serverTimestamp(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = content;
    }
    return message;
  };
  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat('Type contents first'));
      return;
    }
    setLoading(true);

    try {
      await set(push(child(messageRef, currentChatRoom.id)), createMessage());
      setLoading(false);
      setContent('');
      setErrors([]);
    } catch (error) {
      console.error(error);
      setErrors((prev) => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="">
          <Form.Control
            value={content}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>

      <ProgressBar variant="warning" label="60%" now={60} />

      <div>
        {errors.map((errorMessage, i) => (
          <p key={i} style={{ color: 'red' }}>
            {errorMessage}
          </p>
        ))}
      </div>

      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: '100%' }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: '100%' }}>
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  );
};
