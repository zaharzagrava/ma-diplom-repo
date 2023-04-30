import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import router from './router';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  );
}

export default App;
