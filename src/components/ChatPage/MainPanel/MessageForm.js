import { child, ref, serverTimestamp, set, push } from 'firebase/database';
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
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const user = useSelector((state) => state.user.currentUser);

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

  const imageInputRef = useRef(null);

  const handleOpenImage = () => {
    imageInputRef.current.click();
  };

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filePath = `message/public/${file.name}`;
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
          console.log(uploadImage);
          const imageUrl = getDownloadURL(uploadImage.snapshot.ref).then(
            (res) =>
              set(
                push(child(messageRef, currentChatRoom.id)),
                createMessage(res)
              )
          );
          setLoading(false);
          console.log(imageUrl);
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
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
