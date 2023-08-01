import { ChatRooms } from './ChatRooms';
import { DirectMessages } from './DirectMessages';
import { Favorited } from './Favorited';
import { UserPanel } from './UserPanel';

export const SidePanel = () => {
  return (
    <div
      style={{
        backgroundColor: '#7b83eb',
        padding: '2rem',
        minHeight: '100vh',
        color: '#fff',
        minWidth: '275px',
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
};
