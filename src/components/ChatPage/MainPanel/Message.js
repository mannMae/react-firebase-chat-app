import moment from 'moment';
import { Card } from 'react-bootstrap';

export const Message = ({ message, user }) => {
  const timeFromNow = (timeStamp) => moment(timeStamp).fromNow();
  const isImage = (message) =>
    message.hasOwnProperty('image') && !message.hasOwnProperty('content');
  return (
    <Card>
      <img
        style={{ borderRadius: '10px' }}
        height={48}
        width={48}
        src={message.user.image}
        className="mr-3"
      />
      <Card.Body>
        <h6>
          {message.user.name}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timeStamp)}
          </span>
        </h6>
        {isImage(message) ? (
          <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image} />
        ) : (
          <p>{message.content}</p>
        )}
      </Card.Body>
    </Card>
  );
};
