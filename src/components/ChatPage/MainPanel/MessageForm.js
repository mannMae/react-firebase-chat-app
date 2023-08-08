import {
  child,
  ref,
  serverTimestamp,
  set,
  push,
  remove,
} from 'firebase/database';
import { useRef, useState } from 'react';
import { Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { firebaseDatabase, firebaseStorage } from '../../../firebase';
import { useSelector } from 'react-redux';
import {
  uploadBytesResumable,
  ref as stRef,
  getDownloadURL,
} from 'firebase/storage';

export const MessageForm = () => {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageRef = ref(firebaseDatabase, 'messages');
  const typingRef = ref(firebaseDatabase, 'typing');
  const { currentChatRoom, isPrivateChatRoom } = useSelector(
    (state) => state.chatRoom
  );
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (e.target.value) {
      set(
        child(child(typingRef, currentChatRoom.id), currentUser.uid),
        currentUser.displayName
      );
    } else {
      remove(child(child(typingRef, currentChatRoom.id), currentUser.uid));
    }
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timeStamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
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

      remove(child(child(typingRef, currentChatRoom.id), currentUser.uid));

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

  const imageInputRef = useRef(null);

  const handleOpenImage = () => {
    imageInputRef.current.click();
  };

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const getPath = (fileName) => {
    return `message/${
      isPrivateChatRoom ? `private/${currentChatRoom.id}` : 'public'
    }/${fileName}`;
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filePath = getPath(file.name);
    const metadata = { contentType: file.type };
    const storage = stRef(firebaseStorage, filePath);
    setLoading(true);
    try {
      const uploadImage = uploadBytesResumable(storage, file, metadata);
      uploadImage.on(
        'state_changed',
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadPercentage(percentage);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        },
        () => {
          const imageUrl = getDownloadURL(uploadImage.snapshot.ref).then(
            (res) =>
              set(
                push(child(messageRef, currentChatRoom.id)),
                createMessage(res)
              )
          );
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="">
          <Form.Control
            onKeyDown={handleKeyDown}
            value={content}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>
      {uploadPercentage !== 0 && uploadPercentage !== 100 && (
        <ProgressBar
          variant="warning"
          label={`${uploadPercentage}%`}
          now={uploadPercentage}
        />
      )}

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
            disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            onClick={handleOpenImage}
            className="message-form-button"
            style={{ width: '100%' }}
            disabled={loading ? true : false}
          >
            UPLOAD
          </button>
          <input
            accept="image/jpeg, image/png"
            style={{ display: 'none' }}
            type="file"
            ref={imageInputRef}
            onChange={handleUploadImage}
          />
        </Col>
      </Row>
    </div>
  );
};
