import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  Image,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { child, get, ref, remove, update } from 'firebase/database';
import { firebaseDatabase } from '../../../firebase';

export const MessageHeader = ({ handleSearchChange }) => {
  const { currentChatRoom, isPrivateChatRoom, userPosts } = useSelector(
    (state) => state.chatRoom
  );
  const { currentUser } = useSelector((state) => state.user);
  const userRef = ref(firebaseDatabase, 'users');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    addFavoriteListener();
  }, []);

  const addFavoriteListener = () => {
    if (!currentUser?.uid || !currentChatRoom?.id) {
      return;
    }
    get(child(child(userRef, currentUser.uid), 'favorited')).then((res) => {
      if (res.val() === null) {
        return;
      }
      const chatRoomIds = Object.keys(res.val());
      const isAlreadyFavorited = chatRoomIds.includes(currentChatRoom.id);
      setIsFavorited(isAlreadyFavorited);
    });
  };

  const handleFavorite = () => {
    if (isFavorited) {
      remove(
        child(
          child(userRef, `${currentUser.uid}/favorited`),
          currentChatRoom.id
        )
      );
      setIsFavorited(false);
    } else {
      const favoritedRoom = {
        [currentChatRoom.id]: {
          name: currentChatRoom.name,
          description: currentChatRoom.description,
          createdBy: {
            name: currentChatRoom.createdBy.name,
            image: currentChatRoom.createdBy.image,
          },
        },
      };

      update(child(userRef, `${currentUser.uid}/favorited`), favoritedRoom);
      setIsFavorited(true);
    }
  };
  console.log(userPosts);
  return (
    <div
      style={{
        width: '100%',
        height: '200px',
        border: '0.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2 style={{ display: 'flex' }}>
              {isPrivateChatRoom ? <FaLock /> : <FaLockOpen />}
              {currentChatRoom && currentChatRoom.name}
              {!isPrivateChatRoom && (
                <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                  {isFavorited ? (
                    <MdFavorite style={{ marginBottom: '7px' }} />
                  ) : (
                    <MdFavoriteBorder style={{ marginBottom: '7px' }} />
                  )}
                </span>
              )}
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p>
            <Image
              src={currentChatRoom?.createdBy?.image}
              roundedCircle
              style={{ width: '30px', height: '30px' }}
            />{' '}
            {currentChatRoom?.createdBy?.name}
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0' }}>
                  <Accordion.Header
                    as={Button}
                    variant="link"
                    eventKey="0"
                    style={{ padding: '0', display: 'flex', width: '100%' }}
                  >
                    Description
                  </Accordion.Header>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>{currentChatRoom?.description}</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0' }}>
                  <Accordion.Header
                    as={Button}
                    variant="link"
                    eventKey="0"
                    style={{ padding: '0', display: 'flex', width: '100%' }}
                  >
                    Posts Count
                  </Accordion.Header>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {userPosts &&
                      Object.entries(userPosts)
                        .sort((a, b) => b[1].count - a[1].count)
                        .map(([key, value], i) => {
                          console.log(key, value);
                          return (
                            <div
                              key={i}
                              style={{ display: 'flex', gap: '5px' }}
                            >
                              <img
                                style={{
                                  borderRadius: '50%',
                                  width: '48px',
                                  height: '48px',
                                }}
                                src={value.image}
                                alt={value.name}
                              />
                              <div
                                style={{
                                  padding: '3px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justiffyContent: 'center',
                                }}
                              >
                                <h6 style={{ margin: '0' }}>{key}</h6>
                                <span>Posts : {value.count}</span>
                              </div>
                            </div>
                          );
                        })}
                  </Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
