import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './router/Router';
import useCheckAuth from './utils/useCheckAuth';
import { useDispatch } from "react-redux";
import { login } from './app/slices/userSlice';
import MainMenu from './components/mainMenu/MainMenu';
import Loader from './components/otherComponents/loader/Loader';
import QuickTitles from './components/QuickTitles';

// ${process.env.PUBLIC_URL}

function App() {
  const { data, isLoading, isSuccess } = useCheckAuth();
  const dispatch = useDispatch();

  /* Replace with loading window */
  if (isLoading) return <Loader noLogo={true}/>;

  if (isSuccess) {
    dispatch(login(data.data.user));
  }

  return (
    <div className="App">

        <Router>
          <MainMenu></MainMenu>
          <QuickTitles></QuickTitles>
          <AppRoutes></AppRoutes>
        </Router>
    </div>
  );
}

export default App;
