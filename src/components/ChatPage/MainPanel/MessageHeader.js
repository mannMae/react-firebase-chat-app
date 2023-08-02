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
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

export const MessageHeader = () => {
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
              <FaLock /> ChatRoomName <MdFavorite />
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p>
            <Image src="" /> user name
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
                    Click me!
                  </Accordion.Header>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
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
                    Click me!
                  </Accordion.Header>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
