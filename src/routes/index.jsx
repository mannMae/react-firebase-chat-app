import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import { ChatPage } from '../components/ChatPage/ChatPage';
import { LoginPage } from '../components/LoginPage/LoginPage';
import { RegisterPage } from '../components/RegisterPage/RegisterPage';

const App = () => {
  return <section></section>;
};

export const AppRoutes = () => {
  //   const routes = [
  //     {
  //       path: '/',
  //       element: <App />,
  //       children: [
  //         { path: '/', element: <ChatPage /> },
  //         { path: '*', element: <Navigate to="/" /> },
  //       ],
  //     },
  //   ];
  //   const element = useRoutes([...routes]);

  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};
