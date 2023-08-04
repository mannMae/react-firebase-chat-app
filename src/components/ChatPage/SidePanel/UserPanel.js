import { signOut, updateProfile } from 'firebase/auth';
import { Dropdown, Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import {
  firebaseAuth,
  firebaseDatabase,
  firebaseStorage,
} from '../../../firebase';
import { useRef } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { setPhotoUrl } from '../../../redux/actions/userAction';
import { child, set, ref as rbRef, update } from 'firebase/database';

export const UserPanel = () => {
  const user = useSelector((state) => state.user.currentUser);
  const handleLogout = () => {
    signOut(firebaseAuth);
  };

  const inputImageRef = useRef(null);

  const handleChangeProfile = () => {
    inputImageRef.current.click();
  };

  const dispatch = useDispatch();

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const metadata = { contentType: file.type };

    try {
      const storage = ref(firebaseStorage, `userImage/${user.uid}`);
      const uploadImage = await uploadBytesResumable(storage, file, metadata);
      const imageUrl = await getDownloadURL(uploadImage.ref);

      await updateProfile(firebaseAuth.currentUser, {
        photoURL: imageUrl,
      });
      dispatch(setPhotoUrl(imageUrl));
      await update(child(rbRef(firebaseDatabase, 'users/'), user.uid), {
        image: imageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 style={{ color: 'white' }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          src={user && user.photoURL}
          style={{ width: '30px', height: '30px', marginTop: '3px' }}
          roundedCircle
        />

        <Dropdown>
          <Dropdown.Toggle style={{ background: 'transparent', border: '0px' }}>
            {user && user.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleChangeProfile}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input
          onChange={handleUploadImage}
          accept="image/jpeg, image/png"
          type="file"
          ref={inputImageRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};
