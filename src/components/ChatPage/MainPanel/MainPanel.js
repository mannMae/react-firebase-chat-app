import { Message } from './Message';
import { MessageForm } from './MessageForm';
import { MessageHeader } from './MessageHeader';

export const MainPanel = () => {
  return (
    <div style={{ padding: '2rem 2rem 0 2rem' }}>
      <MessageHeader />

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
        <Message />
      </div>

      <MessageForm />
    </div>
  );
};
