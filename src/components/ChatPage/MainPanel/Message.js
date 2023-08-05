import moment from 'moment';

export const Message = ({ message, user }) => {
  const timeFromNow = (timeStamp) => moment(timeStamp).fromNow();
  const isImage = (message) =>
    message.hasOwnProperty('image') && !message.hasOwnProperty('content');

  const isMessageMine = (message, user) => {
    return message.user.id === user.uid;
  };

  return (
    <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
      <img
        style={{ borderRadius: '10px' }}
        height={48}
        width={48}
        src={message.user.image}
        className="mr-3"
      />
      <div
        style={{
          backgroundColor: isMessageMine(message, user) && '#ececec',
          width: '300px',
        }}
      >
        <h6>
          {message.user.name}{' '}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timeStamp)}
          </span>
        </h6>
        {isImage(message) ? (
          <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image} />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};
