import React from 'react';
import './App.css';
import { createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import AppContainer from './containers/AppContainer/AppContainer';
import { createBrowserRouter } from 'react-router-dom';
import HomeContainer from './containers/HomeContainter/HomeContainer';
import router from './router';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  );
}

export default App;
