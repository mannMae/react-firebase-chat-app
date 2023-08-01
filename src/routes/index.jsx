import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useRoutes,
} from 'react-router-dom';
import { ChatPage } from '../components/ChatPage/ChatPage';
import { LoginPage } from '../components/LoginPage/LoginPage';
import { RegisterPage } from '../components/RegisterPage/RegisterPage';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/actions/userAction';

const App = () => {
  return <section></section>;
};

export const AppRoutes = (props) => {
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
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  console.log(isLoading);
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        naviagate('/');
        dispatch(setUser(user));
      } else {
        naviagate('/login');
      }
    });
  }, []);

  if (isLoading) {
    return;
  }

  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};
